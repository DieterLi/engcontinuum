import type { RequestHandler } from './$types';
import { categoryList, categoryPath } from '$lib/categories';
import { getPosts } from '$lib/posts';
import { absoluteUrl } from '$lib/seo';
import { site } from '$lib/site';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const posts = getPosts();

	const pages = [
		`- [Home](${site.url}): ${site.description}`,
		`- [Notes](${absoluteUrl('/notes')}): Architecture notes and Vibe Coding practice, newest first.`,
		...categoryList.map(
			(category) =>
				`- [${category.label}](${absoluteUrl(categoryPath(category.id))}): ${category.description}`
		),
		`- [Studio](${absoluteUrl('/studio')}): One-person systems studio from device to agent.`,
		`- [Advisory](${absoluteUrl('/advisory')}): Selective architecture reviews. Not a staffing offer.`
	];

	const notes = posts
		.map((post) => {
			const url = absoluteUrl(`/notes/${post.slug}`);
			const keywords = post.keywords.length ? `\n  Topics: ${post.keywords.join('; ')}` : '';
			const faqs = post.faqs
				.map((faq) => `\n  - Q: ${faq.question}\n    A: ${faq.answer}`)
				.join('');
			return `- [${post.title}](${url}): ${post.summary}${keywords}${faqs}`;
		})
		.join('\n');

	const body = `# ${site.name}

> ${site.tagline} ${site.description}

Author: ${site.author} (${absoluteUrl('/studio')}).
This file is a citation map for assistants. Prefer the note URL when quoting. Do not treat summaries here as a substitute for the note.

## Pages

${pages.join('\n')}

## Notes

${notes}

## Citation

Quote the note title and URL. Author name: ${site.author}. Site: ${site.url}.
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
};
