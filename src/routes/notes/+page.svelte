<script lang="ts">
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Notes — {site.name}</title>
	<meta name="description" content="Engineering notes across the continuum." />
</svelte:head>

<section>
	<p class="eyebrow">Index</p>
	<h1 class="display">Notes</h1>
	<p class="lede">
		Decision rules, bring-up scars, and architecture judgment — written for principals and builders
		who ship across layers.
	</p>

	<ul class="list">
		{#each data.posts as post}
			<li>
				<a href={`/notes/${post.slug}`}>
					<div class="row">
						<span class="meta">{post.date}</span>
						{#if post.tags?.length}
							<span class="tags">
								{#each post.tags as tag}
									<span>{tag}</span>
								{/each}
							</span>
						{/if}
					</div>
					<span class="title">{post.title}</span>
					<span class="summary">{post.summary}</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.display {
		margin: 0.7rem 0 0.8rem;
		font-size: clamp(2.2rem, 5vw, 3.4rem);
	}

	.list {
		list-style: none;
		margin: 2rem 0 0;
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
</style>
