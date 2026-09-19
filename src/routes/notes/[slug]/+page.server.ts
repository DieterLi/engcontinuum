import { error } from '@sveltejs/kit';
import { getPost, getPosts } from '$lib/posts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => getPosts().map((p) => ({ slug: p.slug }));

export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
	const post = getPost(params.slug);
	if (!post || post.meta.draft) error(404, 'Not found');
	return { meta: post.meta };
};
