import type { RequestHandler } from './$types';
import { absoluteUrl } from '$lib/seo';

export const prerender = true;

/** GEO convention: some crawlers look under /.well-known/llms.txt */
export const GET: RequestHandler = async () => {
	return new Response(null, {
		status: 307,
		headers: {
			Location: absoluteUrl('/llms.txt')
		}
	});
};
