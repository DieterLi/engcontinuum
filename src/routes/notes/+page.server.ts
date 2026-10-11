import { getPosts } from '$lib/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { posts: getPosts(), category: 'all' as const };
};
