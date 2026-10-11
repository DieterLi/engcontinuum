import { resolveCategory, type CategoryId } from './categories';

export type PostMeta = {
	title: string;
	summary: string;
	date: string;
	slug: string;
	category: CategoryId;
	tags?: string[];
	draft?: boolean;
};

type GlobModule = {
	metadata: Omit<PostMeta, 'slug' | 'category'> & { category?: string };
	default: unknown;
};

const modules = import.meta.glob<GlobModule>('/src/content/notes/*.{md,svx}', { eager: true });

function slugFromPath(path: string): string {
	const file = path.split('/').pop() ?? path;
	return file.replace(/\.(md|svx)$/, '');
}

function normalizeDate(value: string): string {
	const d = new Date(value);
	if (Number.isNaN(+d)) return value;
	return d.toISOString().slice(0, 10);
}

export function getPosts(): PostMeta[] {
	return Object.entries(modules)
		.map(([path, mod]) => {
			const meta = mod.metadata;
			return {
				...meta,
				date: normalizeDate(meta.date),
				slug: slugFromPath(path),
				category: resolveCategory(meta.category).id,
				tags: meta.tags ?? []
			} satisfies PostMeta;
		})
		.filter((p) => !p.draft)
		.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPost(slug: string) {
	const entry = Object.entries(modules).find(([path]) => slugFromPath(path) === slug);
	if (!entry) return null;
	const [path, mod] = entry;
	return {
		component: mod.default,
		meta: {
			...mod.metadata,
			date: normalizeDate(mod.metadata.date),
			slug: slugFromPath(path),
			category: resolveCategory(mod.metadata.category).id,
			tags: mod.metadata.tags ?? []
		} satisfies PostMeta
	};
}
