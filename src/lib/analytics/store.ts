import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { env } from '$env/dynamic/private';
import { hasDurableStore } from './config';

export type PageStats = {
	views: number;
	dwellMs: number;
	dwellCount: number;
};

export type AnalyticsStore = {
	updatedAt: string;
	pages: Record<string, PageStats>;
	days: Record<string, { views: number }>;
};

const REDIS_KEY = 'engcontinuum:analytics:v1';
const emptyStore = (): AnalyticsStore => ({
	updatedAt: new Date().toISOString(),
	pages: {},
	days: {}
});

function filePath(): string {
	if (env.VERCEL) return join('/tmp', 'engcontinuum-analytics.json');
	return join(process.cwd(), 'data', 'analytics.json');
}

async function redisCommand(parts: (string | number)[]): Promise<unknown> {
	const url = env.UPSTASH_REDIS_REST_URL;
	const token = env.UPSTASH_REDIS_REST_TOKEN;
	if (!url || !token) return null;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(parts)
	});
	if (!res.ok) throw new Error(`Upstash ${res.status}`);
	const json = (await res.json()) as { result?: unknown };
	return json.result ?? null;
}

async function readFileStore(): Promise<AnalyticsStore> {
	try {
		const raw = await readFile(filePath(), 'utf8');
		return normalizeStore(JSON.parse(raw));
	} catch {
		return emptyStore();
	}
}

async function writeFileStore(store: AnalyticsStore): Promise<void> {
	const path = filePath();
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, JSON.stringify(store), 'utf8');
}

function normalizeStore(value: unknown): AnalyticsStore {
	if (!value || typeof value !== 'object') return emptyStore();
	const raw = value as Partial<AnalyticsStore>;
	return {
		updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
		pages: raw.pages && typeof raw.pages === 'object' ? raw.pages : {},
		days: raw.days && typeof raw.days === 'object' ? raw.days : {}
	};
}

export async function loadStore(): Promise<{ store: AnalyticsStore; durable: boolean }> {
	if (hasDurableStore()) {
		const result = await redisCommand(['GET', REDIS_KEY]);
		if (typeof result === 'string' && result) {
			return { store: normalizeStore(JSON.parse(result)), durable: true };
		}
		return { store: emptyStore(), durable: true };
	}
	return { store: await readFileStore(), durable: false };
}

export async function saveStore(store: AnalyticsStore): Promise<void> {
	store.updatedAt = new Date().toISOString();
	if (hasDurableStore()) {
		await redisCommand(['SET', REDIS_KEY, JSON.stringify(store)]);
		return;
	}
	await writeFileStore(store);
}

export function normalizePath(path: string): string | null {
	if (!path.startsWith('/')) return null;
	if (path.startsWith('/api') || path.startsWith('/dashboard')) return null;
	if (path.length > 200) return null;
	const clean = path.split('?')[0]?.split('#')[0] ?? '';
	if (!clean.startsWith('/')) return null;
	return clean.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
}

export async function recordView(path: string): Promise<void> {
	const key = normalizePath(path);
	if (!key) return;
	const { store } = await loadStore();
	const page = store.pages[key] ?? { views: 0, dwellMs: 0, dwellCount: 0 };
	page.views += 1;
	store.pages[key] = page;
	const day = new Date().toISOString().slice(0, 10);
	store.days[day] = { views: (store.days[day]?.views ?? 0) + 1 };
	await saveStore(store);
}

export async function recordDwell(path: string, ms: number): Promise<void> {
	const key = normalizePath(path);
	if (!key) return;
	const duration = Math.min(Math.max(Math.round(ms), 0), 30 * 60 * 1000);
	if (duration < 1000) return;
	const { store } = await loadStore();
	const page = store.pages[key] ?? { views: 0, dwellMs: 0, dwellCount: 0 };
	page.dwellMs += duration;
	page.dwellCount += 1;
	store.pages[key] = page;
	await saveStore(store);
}

export type DashboardStats = {
	durable: boolean;
	updatedAt: string;
	totalViews: number;
	viewsToday: number;
	pageCount: number;
	avgArticleDwellSec: number;
	pages: Array<{
		path: string;
		views: number;
		avgDwellSec: number;
		dwellSamples: number;
		isArticle: boolean;
	}>;
};

export async function getDashboardStats(): Promise<DashboardStats> {
	const { store, durable } = await loadStore();
	const today = new Date().toISOString().slice(0, 10);
	const pages = Object.entries(store.pages)
		.map(([path, stats]) => ({
			path,
			views: stats.views,
			avgDwellSec:
				stats.dwellCount > 0 ? Math.round(stats.dwellMs / stats.dwellCount / 1000) : 0,
			dwellSamples: stats.dwellCount,
			isArticle: path.startsWith('/notes/') && !path.startsWith('/notes/category/')
		}))
		.sort((a, b) => b.views - a.views || a.path.localeCompare(b.path));

	const articles = pages.filter((page) => page.isArticle && page.dwellSamples > 0);
	const avgArticleDwellSec =
		articles.length === 0
			? 0
			: Math.round(
					articles.reduce((sum, page) => sum + page.avgDwellSec, 0) / articles.length
				);

	return {
		durable,
		updatedAt: store.updatedAt,
		totalViews: pages.reduce((sum, page) => sum + page.views, 0),
		viewsToday: store.days[today]?.views ?? 0,
		pageCount: pages.length,
		avgArticleDwellSec,
		pages
	};
}
