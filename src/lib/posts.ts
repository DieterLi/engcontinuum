import { resolveCategory, type CategoryId } from './categories';

export type Faq = {
	question: string;
	answer: string;
};

export type PostMeta = {
	title: string;
	summary: string;
	date: string;
	slug: string;
	category: CategoryId;
	tags: string[];
	keywords: string[];
	faqs: Faq[];
	draft?: boolean;
};

type GlobModule = {
	metadata: Omit<PostMeta, 'slug' | 'category' | 'tags' | 'keywords' | 'faqs'> & {
		category?: string;
		tags?: string[];
		keywords?: string[];
		faqs?: Faq[];
	};
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

function toMeta(path: string, meta: GlobModule['metadata']): PostMeta {
	const faqs = (meta.faqs ?? []).filter((faq) => faq?.question && faq?.answer);
	return {
		...meta,
		date: normalizeDate(meta.date),
		slug: slugFromPath(path),
		category: resolveCategory(meta.category).id,
		tags: meta.tags ?? [],
		keywords: meta.keywords ?? [],
		faqs
	};
}

export function getPosts(): PostMeta[] {
	return Object.entries(modules)
		.map(([path, mod]) => toMeta(path, mod.metadata))
		.filter((p) => !p.draft)
		.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPost(slug: string) {
	const entry = Object.entries(modules).find(([path]) => slugFromPath(path) === slug);
	if (!entry) return null;
	const [path, mod] = entry;
	return {
		component: mod.default,
		meta: toMeta(path, mod.metadata)
	};
}

export function getRelatedPosts(slug: string, limit = 2): PostMeta[] {
	const posts = getPosts();
	const current = posts.find((post) => post.slug === slug);
	if (!current) return [];

	return posts
		.filter((post) => post.slug !== slug)
		.map((post) => {
			const sharedTags = post.tags.filter((tag) => current.tags.includes(tag)).length;
			const sameCategory = post.category === current.category ? 2 : 0;
			return { post, score: sharedTags + sameCategory };
		})
		.sort(
			(a, b) => b.score - a.score || +new Date(b.post.date) - +new Date(a.post.date)
		)
		.slice(0, limit)
		.map((entry) => entry.post);
}
