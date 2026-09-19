<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { site } from '$lib/site';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content={site.description} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="site-shell">
	<Header path={page.url.pathname} />
	<main class="site-main">
		{@render children()}
	</main>
	<Footer />
</div>
