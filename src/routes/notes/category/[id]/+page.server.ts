import { error } from '@sveltejs/kit';
import { categories, type CategoryId } from '$lib/categories';
import { getPosts } from '$lib/posts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () =>
	Object.keys(categories).map((id) => ({ id }));

export const load: PageServerLoad = async ({ params }) => {
	if (!(params.id in categories)) error(404, 'Not found');
	return {
		posts: getPosts(),
		category: params.id as CategoryId
	};
};
