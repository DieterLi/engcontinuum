import { categoryPath } from './categories';
import { site } from './site';
import type { PostMeta } from './posts';

export function absoluteUrl(path: string): string {
	if (path.startsWith('http')) return path;
	return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export function jsonLd(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

export function siteGraphJsonLd(): string {
	return jsonLd({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${site.url}/#website`,
				url: site.url,
				name: site.name,
				description: site.description,
				inLanguage: 'en',
				publisher: { '@id': `${site.url}/#person` }
			},
			{
				'@type': 'Person',
				'@id': `${site.url}/#person`,
				name: site.author,
				url: `${site.url}/studio`,
				email: site.email,
				sameAs: [site.github]
			}
		]
	});
}

export function collectionJsonLd(opts: {
	url: string;
	name: string;
	description: string;
	posts: PostMeta[];
}): string {
	return jsonLd({
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': opts.url,
		url: opts.url,
		name: opts.name,
		description: opts.description,
		isPartOf: { '@id': `${site.url}/#website` },
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: opts.posts.map((post, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				url: absoluteUrl(`/notes/${post.slug}`),
				name: post.title
			}))
		}
	});
}

export function articleJsonLd(post: PostMeta): string {
	const url = absoluteUrl(`/notes/${post.slug}`);
	const graph: Record<string, unknown>[] = [
		{
			'@type': 'TechArticle',
			'@id': `${url}#article`,
			headline: post.title,
			description: post.summary,
			datePublished: post.date,
			dateModified: post.date,
			inLanguage: 'en',
			keywords: post.keywords.join(', '),
			articleSection: post.category,
			author: { '@id': `${site.url}/#person` },
			publisher: { '@id': `${site.url}/#person` },
			mainEntityOfPage: url,
			isPartOf: { '@id': `${site.url}/#website` },
			url
		},
		{
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Notes', item: absoluteUrl('/notes') },
				{
					'@type': 'ListItem',
					position: 2,
					name: post.category === 'practice' ? 'Practice' : 'Notes',
					item: absoluteUrl(categoryPath(post.category))
				},
				{ '@type': 'ListItem', position: 3, name: post.title, item: url }
			]
		}
	];

	if (post.faqs.length) {
		graph.push({
			'@type': 'FAQPage',
			'@id': `${url}#faq`,
			mainEntity: post.faqs.map((faq) => ({
				'@type': 'Question',
				name: faq.question,
				acceptedAnswer: { '@type': 'Answer', text: faq.answer }
			}))
		});
	}

	return jsonLd({ '@context': 'https://schema.org', '@graph': graph });
}
