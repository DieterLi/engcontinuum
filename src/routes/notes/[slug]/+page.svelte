<script lang="ts">
	import { site } from '$lib/site';
	import { getPost } from '$lib/posts';
	import type { PageData } from './$types';
	import type { Component } from 'svelte';

	let { data }: { data: PageData } = $props();
	const Post = $derived(getPost(data.meta.slug)?.component as Component | undefined);
</script>

<svelte:head>
	<title>{data.meta.title} — {site.name}</title>
	<meta name="description" content={data.meta.summary} />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.summary} />
</svelte:head>

<article>
	<p class="eyebrow">Note</p>
	<h1 class="display">{data.meta.title}</h1>
	<p class="meta">{data.meta.date} · {site.author}</p>
	<p class="summary">{data.meta.summary}</p>

	<div class="prose body">
		{#if Post}
			<Post />
		{/if}
	</div>

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
		max-width: 16ch;
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
