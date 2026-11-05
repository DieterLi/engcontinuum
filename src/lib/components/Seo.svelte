<script lang="ts">
	import { site } from '$lib/site';
	import { primaryKeywords } from '$lib/topics';

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
	const keywordList = $derived(keywords.length ? keywords : primaryKeywords);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="author" content={site.author} />
	<meta name="keywords" content={keywordList.join(', ')} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:locale" content="en_US" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<link rel="alternate" type="text/plain" title="llms.txt" href="{site.url}/llms.txt" />
	{#if published}
		<meta property="article:published_time" content={published} />
		<meta property="article:author" content={site.author} />
		{#each keywordList.slice(0, 8) as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
	{#if jsonLd}
		{@html jsonLd}
	{/if}
</svelte:head>
