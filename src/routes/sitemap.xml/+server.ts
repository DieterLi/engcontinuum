import type { RequestHandler } from './$types';
import { categoryList, categoryPath } from '$lib/categories';
import { getPosts } from '$lib/posts';
import { absoluteUrl } from '$lib/seo';
import { site } from '$lib/site';

export const prerender = true;

function xml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const GET: RequestHandler = async () => {
	const posts = getPosts();
	const newest = posts[0]?.date;

	const staticPaths = [
		{ path: '', lastmod: newest },
		{ path: '/notes', lastmod: newest },
		...categoryList.map((category) => ({
			path: categoryPath(category.id),
			lastmod: posts.find((post) => post.category === category.id)?.date ?? newest
		})),
		{ path: '/studio', lastmod: newest },
		{ path: '/advisory', lastmod: newest },
		{ path: '/llms.txt', lastmod: newest }
	];

	const urls = [
		...staticPaths.map((entry) => ({
			loc: entry.path ? absoluteUrl(entry.path) : site.url,
			lastmod: entry.lastmod
		})),
		...posts.map((post) => ({
			loc: absoluteUrl(`/notes/${post.slug}`),
			lastmod: post.date
		}))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(entry) => `  <url>
    <loc>${xml(entry.loc)}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}
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
