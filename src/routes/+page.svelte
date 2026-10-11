<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { collectionJsonLd } from '$lib/seo';
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo
	title="{site.name} — {site.tagline}"
	description={site.description}
	jsonLd={collectionJsonLd({
		url: site.url,
		name: site.name,
		description: site.description,
		posts: data.posts
	})}
/>

<section class="hero">
	<p class="eyebrow">Systems studio</p>
	<h1 class="display">
		<span class="brand-line">{site.name}</span>
		<span class="headline">Judgment across the full path — board to agent.</span>
	</h1>
	<p class="lede">
		Hardware, firmware, protocols, cloud services, and AI-augmented delivery — one continuum.
		Notes for operators who price architecture, not tutorials for hire.
	</p>
	<div class="actions">
		<a class="btn btn-primary" href="/notes">Read the notes</a>
		<a class="btn btn-ghost" href="/advisory">Selective advisory</a>
	</div>
</section>

<section class="strip panel">
	<div>
		<p class="kicker">Practice</p>
		<p class="value">Device → protocol → service → agent</p>
	</div>
	<div>
		<p class="kicker">Mode</p>
		<p class="value">One-person studio + AI leverage</p>
	</div>
	<div>
		<p class="kicker">Offer</p>
		<p class="value">Authority IP · selective reviews</p>
	</div>
</section>

<section class="latest">
	<div class="section-head">
		<h2 class="display">Latest notes</h2>
		<a href="/notes">All notes →</a>
	</div>
	{#if data.posts.length === 0}
		<p class="empty">First notes are on the way.</p>
	{:else}
		<ul class="list">
			{#each data.posts as post}
				<li>
					<a href={`/notes/${post.slug}`}>
						<span class="meta">{post.date}</span>
						<span class="title">{post.title}</span>
						<span class="summary">{post.summary}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.hero {
		padding: 3.5rem 0 2.5rem;
		animation: rise 700ms var(--ease) both;
	}

	.brand-line {
		display: block;
		font-size: clamp(2.8rem, 8vw, 5.4rem);
		color: var(--ink);
		margin-bottom: 0.85rem;
	}

	.headline {
		display: block;
		max-width: 18ch;
		font-size: clamp(1.55rem, 3.4vw, 2.35rem);
		font-weight: 500;
		color: color-mix(in srgb, var(--ink) 88%, var(--accent));
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1.8rem;
	}

	.strip {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		padding: 1.25rem 1.35rem;
		margin: 1rem 0 3rem;
		animation: rise 850ms var(--ease) both;
	}

	.kicker {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}

	.value {
		margin: 0.4rem 0 0;
		font-family: var(--font-display);
		font-weight: 600;
		letter-spacing: -0.02em;
		font-size: 1.05rem;
	}

	.latest {
		animation: rise 1000ms var(--ease) both;
	}

	.section-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.section-head h2 {
		margin: 0;
		font-size: 1.6rem;
	}

	.section-head a {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		text-decoration: none;
		color: var(--ink-muted);
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.75rem;
	}

	.list a {
		display: grid;
		gap: 0.35rem;
		padding: 1.1rem 1.15rem;
		border: 1px solid var(--line);
		border-radius: 4px;
		text-decoration: none;
		background: color-mix(in srgb, var(--bg-elevated) 70%, transparent);
		transition:
			border-color 180ms var(--ease),
			transform 180ms var(--ease);
	}

	.list a:hover {
		border-color: var(--accent);
		transform: translateY(-1px);
		color: inherit;
	}

	.title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.2rem;
		letter-spacing: -0.02em;
	}

	.summary {
		color: var(--ink-muted);
		font-size: 0.98rem;
	}

	.empty {
		color: var(--ink-muted);
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 800px) {
		.strip {
			grid-template-columns: 1fr;
		}
	}
</style>
