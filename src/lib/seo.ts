import { categoryPath } from './categories';
import { useCases } from './offers';
import { site } from './site';
import type { PostMeta } from './posts';
import { primaryKeywords, topicClusters } from './topics';

export function absoluteUrl(path: string): string {
	if (path.startsWith('http')) return path;
	return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export function jsonLd(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

export function siteGraphJsonLd(): string {
	const knowsAbout = topicClusters.flatMap((cluster) =>
		cluster.phrases.map((name) => ({ '@type': 'Thing', name }))
	);

	return jsonLd({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${site.url}/#website`,
				url: site.url,
				name: site.name,
				alternateName: ['Eng Continuum', 'EngContinuum assurance studio'],
				description: site.description,
				inLanguage: 'en',
				keywords: primaryKeywords.join(', '),
				publisher: { '@id': `${site.url}/#person` },
				about: knowsAbout,
				speakable: {
					'@type': 'SpeakableSpecification',
					cssSelector: ['.lede', '.summary', '.faqs']
				}
			},
			{
				'@type': 'Person',
				'@id': `${site.url}/#person`,
				name: site.author,
				url: `${site.url}/studio`,
				email: site.email,
				jobTitle: 'Assurance architect — device to agentic AI',
				knowsAbout: primaryKeywords,
				sameAs: [site.github]
			},
			{
				'@type': 'Organization',
				'@id': `${site.url}/#organization`,
				name: site.name,
				url: site.url,
				description: site.description,
				founder: { '@id': `${site.url}/#person` },
				knowsAbout: primaryKeywords,
				sameAs: [site.github]
			}
		]
	});
}

export function offerJsonLd(): string {
	return jsonLd({
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		'@id': `${site.url}/#service`,
		name: site.name,
		url: site.url,
		description: site.description,
		email: site.email,
		provider: { '@id': `${site.url}/#person` },
		areaServed: 'Worldwide',
		serviceType: [
			'Closed-source edge Agent SDK',
			'Agentic AI architecture audit',
			'Ontology / continuum readiness review'
		],
		knowsAbout: primaryKeywords,
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: 'Use cases',
			itemListElement: useCases.map((item, index) => ({
				'@type': 'Offer',
				name: `Case ${item.code}: ${item.title}`,
				description: `${item.metric}. ${item.metricNote}. ${item.detail}`,
				url: item.source ? absoluteUrl(item.source) : `${site.url}/#${item.id}`,
				position: index + 1
			}))
		}
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
