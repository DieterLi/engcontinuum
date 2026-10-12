<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Analytics from '$lib/components/Analytics.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { site } from '$lib/site';
	import { siteGraphJsonLd } from '$lib/seo';
	import { page } from '$app/state';

	let { children } = $props();

	const isDashboard = $derived(page.url.pathname.startsWith('/dashboard'));

	const canonicalHref = $derived.by(() => {
		const path = page.url.pathname;
		const normalized = path === '/' ? '' : path.replace(/\/$/, '');
		return `${site.url}${normalized}`;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if !isDashboard}
		<link rel="canonical" href={canonicalHref} />
		<link rel="alternate" type="text/plain" href="{site.url}/llms.txt" title="LLM guidance" />
		<meta property="og:site_name" content={site.name} />
		<meta property="og:url" content={canonicalHref} />
		<meta name="twitter:card" content="summary" />
		<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
		{@html siteGraphJsonLd()}
	{/if}
</svelte:head>

{#if isDashboard}
	{@render children()}
{:else}
	<div class="site-shell">
		<Header path={page.url.pathname} />
		<main class="site-main">
			{@render children()}
		</main>
		<Footer />
	</div>
	<Analytics />
{/if}
