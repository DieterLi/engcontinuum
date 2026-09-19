import type { RequestHandler } from './$types';
import { getPosts } from '$lib/posts';
import { site } from '$lib/site';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const posts = getPosts();
	const staticPaths = ['', '/notes', '/studio', '/advisory'];
	const urls = [
		...staticPaths.map((path) => `${site.url}${path}`),
		...posts.map((p) => `${site.url}/notes/${p.slug}`)
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(loc) => `  <url>
    <loc>${loc}</loc>
  </url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
};
