<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { site } from '$lib/site';
	import { siteGraphJsonLd } from '$lib/seo';
	import { page } from '$app/state';

	let { children } = $props();

	const canonicalHref = $derived.by(() => {
		const path = page.url.pathname;
		const normalized = path === '/' ? '' : path.replace(/\/$/, '');
		return `${site.url}${normalized}`;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="canonical" href={canonicalHref} />
	<link rel="alternate" type="text/plain" href="{site.url}/llms.txt" title="LLM guidance" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:url" content={canonicalHref} />
	<meta name="twitter:card" content="summary" />
	<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
	{@html siteGraphJsonLd()}
</svelte:head>

<div class="site-shell">
	<Header path={page.url.pathname} />
	<main class="site-main">
		{@render children()}
	</main>
	<Footer />
</div>
