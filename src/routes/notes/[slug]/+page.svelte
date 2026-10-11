<script lang="ts">
	import { resolveCategory } from '$lib/categories';
	import Seo from '$lib/components/Seo.svelte';
	import { articleJsonLd } from '$lib/seo';
	import { site } from '$lib/site';
	import { getPost, getRelatedPosts } from '$lib/posts';
	import type { PageData } from './$types';
	import type { Component } from 'svelte';

	let { data }: { data: PageData } = $props();
	const Post = $derived(getPost(data.meta.slug)?.component as Component | undefined);
	const category = $derived(resolveCategory(data.meta.category));
	const related = $derived(getRelatedPosts(data.meta.slug));
</script>

<Seo
	title={data.meta.title}
	description={data.meta.summary}
	type="article"
	published={data.meta.date}
	keywords={data.meta.keywords}
	jsonLd={articleJsonLd(data.meta)}
/>

<article>
	<p class="eyebrow">
		<a href={`/notes?category=${category.id}`}>{category.label}</a>
	</p>
	<h1 class="display">{data.meta.title}</h1>
	<p class="meta">
		<time datetime={data.meta.date}>{data.meta.date}</time>
		· <a href="/studio">{site.author}</a>
	</p>
	<p class="summary">{data.meta.summary}</p>

	<div class="prose body">
		{#if Post}
			<Post />
		{/if}
	</div>

	{#if data.meta.faqs.length}
		<section class="faqs" aria-labelledby="note-questions">
			<h2 id="note-questions">Questions this note answers</h2>
			{#each data.meta.faqs as faq}
				<h3>{faq.question}</h3>
				<p>{faq.answer}</p>
			{/each}
		</section>
	{/if}

	{#if related.length}
		<section class="related" aria-labelledby="related-notes">
			<h2 id="related-notes">Related notes</h2>
			<ul>
				{#each related as post}
					<li>
						<a href={`/notes/${post.slug}`}>{post.title}</a>
						<span>{post.summary}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<footer class="foot panel">
		<p>
			More from the continuum on <a href="/notes">Notes</a>. For selective architecture reviews,
			see <a href="/advisory">Advisory</a>.
		</p>
	</footer>
</article>

<style>
	.display {
		margin: 0.55rem 0 0.7rem;
		font-size: clamp(2rem, 5vw, 3.1rem);
		max-width: 28ch;
	}

	.eyebrow a {
		text-decoration: none;
		color: inherit;
	}

	.eyebrow a:hover {
		color: var(--accent);
	}

	.summary {
		color: var(--ink-muted);
		font-size: 1.12rem;
		max-width: 38rem;
		margin: 0.8rem 0 2rem;
	}

	.body {
		padding-top: 0.5rem;
		border-top: 1px solid var(--line);
		overflow-x: auto;
	}

	:global(.body.prose) {
		max-width: min(100%, 48rem);
	}

	.faqs,
	.related {
		margin-top: 2.4rem;
		padding-top: 0.4rem;
		border-top: 1px solid var(--line);
	}

	.faqs h2,
	.related h2 {
		font-family: var(--font-display);
		font-size: 1.35rem;
		letter-spacing: -0.03em;
		margin: 0.6rem 0 1rem;
	}

	.faqs h3 {
		font-family: var(--font-display);
		font-size: 1.05rem;
		margin: 1.2rem 0 0.35rem;
	}

	.faqs p,
	.related span {
		color: var(--ink-muted);
	}

	.related ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.85rem;
	}

	.related a {
		display: block;
		font-family: var(--font-display);
		font-weight: 700;
		text-decoration: none;
	}

	.related span {
		display: block;
		margin-top: 0.2rem;
	}

	.meta a {
		text-decoration: none;
	}

	.foot {
		margin-top: 2.5rem;
		padding: 1rem 1.15rem;
		color: var(--ink-muted);
	}

	.foot p {
		margin: 0;
	}
</style>
