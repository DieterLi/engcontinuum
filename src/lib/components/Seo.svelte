<script lang="ts">
	import { site } from '$lib/site';

	let {
		title,
		description,
		type = 'website',
		published,
		keywords = [],
		jsonLd = ''
	}: {
		title: string;
		description: string;
		type?: 'website' | 'article';
		published?: string;
		keywords?: string[];
		jsonLd?: string;
	} = $props();

	const fullTitle = $derived(title.includes(site.name) ? title : `${title} — ${site.name}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:locale" content="en_US" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	{#if published}
		<meta property="article:published_time" content={published} />
	{/if}
	{#if keywords.length}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	{#if jsonLd}
		{@html jsonLd}
	{/if}
</svelte:head>
