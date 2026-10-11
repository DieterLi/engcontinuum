<script lang="ts">
	import { page } from '$app/state';
	import { categoryList, resolveCategory, type CategoryId } from '$lib/categories';
	import Seo from '$lib/components/Seo.svelte';
	import { absoluteUrl, collectionJsonLd } from '$lib/seo';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const activeCategory = $derived.by((): CategoryId | 'all' => {
		const raw = page.url.searchParams.get('category');
		if (!raw || raw === 'all') return 'all';
		return resolveCategory(raw).id;
	});

	const filtered = $derived(
		activeCategory === 'all'
			? data.posts
			: data.posts.filter((post) => post.category === activeCategory)
	);

	const listing = $derived.by(() => {
		if (activeCategory === 'practice') {
			return {
				title: 'Vibe Coding practice notes',
				heading: 'Practice',
				description:
					'Personal Vibe Coding notes: contract-first prompts, Cursor, OpenCode, and Hermes CLI for turning a PRD into a running frontend, API, and database.',
				lede: 'Repeatable workflows for AI-assisted delivery. Contract first, then code — from a PRD to a running frontend, API, and database.'
			};
		}
		if (activeCategory === 'notes') {
			return {
				title: 'Architecture notes',
				heading: 'Notes',
				description:
					'Architecture notes on device power boundaries, protocol ownership, and how a one-person studio keeps discovery and an owned home apart.',
				lede: 'Decision rules for devices, protocols, and a one-person studio. Power, boundaries, and where trust actually settles.'
			};
		}
		return {
			title: 'Notes',
			heading: 'Notes',
			description:
				'Engineering notes on device architecture, studio distribution, and a Vibe Coding workflow from a PRD to a running full stack.',
			lede: 'Decision rules, bring-up scars, and architecture judgment — plus a Vibe Coding practice for turning a PRD into a running stack.'
		};
	});

	const listingUrl = $derived(
		activeCategory === 'all' ? absoluteUrl('/notes') : absoluteUrl(`/notes?category=${activeCategory}`)
	);
</script>

<Seo
	title={listing.title}
	description={listing.description}
	jsonLd={collectionJsonLd({
		url: listingUrl,
		name: listing.title,
		description: listing.description,
		posts: filtered
	})}
/>

<section>
	<p class="eyebrow">Index</p>
	<h1 class="display">{listing.heading}</h1>
	<p class="lede">{listing.lede}</p>

	<div class="filters" role="tablist" aria-label="Categories">
		<a
			href="/notes"
			class="filter"
			class:active={activeCategory === 'all'}
			role="tab"
			aria-selected={activeCategory === 'all'}
		>
			All
		</a>
		{#each categoryList as cat}
			<a
				href={`/notes?category=${cat.id}`}
				class="filter"
				class:active={activeCategory === cat.id}
				role="tab"
				aria-selected={activeCategory === cat.id}
			>
				{cat.label}
			</a>
		{/each}
	</div>

	{#if activeCategory !== 'all'}
		<p class="cat-desc">{resolveCategory(activeCategory).description}</p>
	{/if}

	<ul class="list">
		{#each filtered as post}
			<li>
				<a href={`/notes/${post.slug}`}>
					<div class="row">
						<span class="meta">{post.date}</span>
						<span class="badges">
							<span class="category">{resolveCategory(post.category).label}</span>
							{#if post.tags?.length}
								<span class="tags">
									{#each post.tags as tag}
										<span>{tag}</span>
									{/each}
								</span>
							{/if}
						</span>
					</div>
					<span class="title">{post.title}</span>
					<span class="summary">{post.summary}</span>
				</a>
			</li>
		{:else}
			<li class="empty">No notes in this category yet.</li>
		{/each}
	</ul>
</section>

<style>
	.display {
		margin: 0.7rem 0 0.8rem;
		font-size: clamp(2.2rem, 5vw, 3.4rem);
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin: 1.6rem 0 0.75rem;
	}

	.filter {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--ink-muted);
		padding: 0.4rem 0.7rem;
		border: 1px solid var(--line);
		border-radius: 2px;
		background: color-mix(in srgb, var(--bg-elevated) 60%, transparent);
	}

	.filter:hover,
	.filter.active {
		color: var(--ink);
		border-color: var(--accent);
		background: var(--accent-soft);
	}

	.cat-desc {
		margin: 0 0 0.5rem;
		color: var(--ink-muted);
		font-size: 0.95rem;
	}

	.list {
		list-style: none;
		margin: 1.25rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.85rem;
	}

	.list a {
		display: grid;
		gap: 0.4rem;
		padding: 1.2rem 1.2rem;
		border: 1px solid var(--line);
		border-radius: 4px;
		text-decoration: none;
		background: color-mix(in srgb, var(--bg-elevated) 75%, transparent);
	}

	.list a:hover {
		border-color: var(--accent);
		color: inherit;
	}

	.row {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.badges {
		display: flex;
		gap: 0.45rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.category {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--accent);
		border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
		padding: 0.15rem 0.4rem;
		border-radius: 2px;
	}

	.tags {
		display: flex;
		gap: 0.45rem;
		flex-wrap: wrap;
	}

	.tags span {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--signal);
		border: 1px solid color-mix(in srgb, var(--signal) 35%, transparent);
		padding: 0.15rem 0.4rem;
		border-radius: 2px;
	}

	.title {
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 700;
		letter-spacing: -0.025em;
	}

	.summary {
		color: var(--ink-muted);
	}

	.empty {
		color: var(--ink-muted);
		padding: 1rem 0;
	}
</style>
