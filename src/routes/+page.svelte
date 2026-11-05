<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { collectionJsonLd, offerJsonLd } from '$lib/seo';
	import { site } from '$lib/site';
	import { primaryKeywords } from '$lib/topics';
	import { useCases } from '$lib/useCases';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo
	title="{site.name} — {site.tagline}"
	description={site.description}
	keywords={primaryKeywords}
	jsonLd={[
		collectionJsonLd({
			url: site.url,
			name: site.name,
			description: site.description,
			posts: data.posts
		}),
		offerJsonLd()
	].join('\n')}
/>

<section class="hero">
	<p class="eyebrow">Assurance studio</p>
	<h1 class="display">
		<span class="brand-line">{site.name}</span>
		<span class="headline">Agentic AI safety from board bring-up to the agent loop.</span>
	</h1>
	<p class="lede">
		High-ticket architecture audits, closed edge Agent SDKs, and ontology-backed agent loops — for
		teams that cannot afford an open-source tour when the product ships.
	</p>
	<div class="actions">
		<a class="btn btn-primary" href={site.engageMailto}>Get closed SDK / architecture audit</a>
		<a class="btn btn-ghost" href="#use-cases">See outcomes in 10 seconds</a>
	</div>
</section>

<section id="use-cases" class="cases" aria-labelledby="cases-heading">
	<div class="section-head">
		<div>
			<p class="eyebrow">Use cases</p>
			<h2 id="cases-heading" class="display">What lands in your product</h2>
		</div>
		<p class="section-aside">Three hard outcomes. Not a blog index.</p>
	</div>

	<ol class="case-grid">
		{#each useCases as useCase, i}
			<li
				class="case panel"
				style={`--i: ${i}`}
			>
				<div class="case-top">
					<span class="case-label">{useCase.label}</span>
					<span class="case-sector">{useCase.sector}</span>
				</div>
				<p class="case-metric">{useCase.metric}</p>
				<h3 class="case-result">{useCase.result}</h3>
				<p class="case-detail">{useCase.detail}</p>
			</li>
		{/each}
	</ol>
</section>

<section class="engage panel" aria-labelledby="engage-heading">
	<div class="engage-copy">
		<p class="eyebrow">Commercial drop</p>
		<h2 id="engage-heading" class="display">If you already see the continuum — book the black box.</h2>
		<p>
			Field notes and <a href="/llms.txt">llms.txt</a> are backstage proof for peers and agents. The
			front door is a compiled capability: same-night delivery when the interface is scoped, with IP
			that stays inside your commercial build.
		</p>
	</div>
	<div class="engage-actions">
		<a class="btn btn-primary" href={site.engageMailto}>Reserve closed SDK / audit</a>
		<a class="btn btn-ghost" href="/advisory">Engagement shapes</a>
	</div>
</section>

<section class="proof" aria-labelledby="proof-heading">
	<div class="section-head">
		<div>
			<p class="eyebrow">Backstage proof</p>
			<h2 id="proof-heading" class="display">Evidence, not the product</h2>
		</div>
		<a href="/notes">All notes →</a>
	</div>
	<p class="proof-lede">
		Geek write-ups and citation maps earn peer trust. Buyers who need the capability inside a
		shipping stack should not have to reverse-engineer it from a post.
	</p>

	{#if data.posts.length === 0}
		<p class="empty">Field notes are on the way.</p>
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
		padding: 3.2rem 0 2rem;
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
		max-width: 22ch;
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

	.cases {
		margin: 1.5rem 0 2.5rem;
		animation: rise 850ms var(--ease) both;
	}

	.section-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.25rem;
		flex-wrap: wrap;
	}

	.section-head h2 {
		margin: 0.45rem 0 0;
		font-size: clamp(1.45rem, 3vw, 1.85rem);
	}

	.section-head a {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		text-decoration: none;
		color: var(--ink-muted);
	}

	.section-aside {
		margin: 0;
		max-width: 16rem;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.02em;
		color: var(--ink-faint);
		text-align: right;
	}

	.case-grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.85rem;
	}

	.case {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		padding: 1.25rem 1.2rem 1.35rem;
		animation: rise 900ms var(--ease) both;
		animation-delay: calc(var(--i) * 90ms);
		transition:
			border-color 200ms var(--ease),
			transform 200ms var(--ease);
	}

	.case:hover {
		border-color: color-mix(in srgb, var(--accent) 55%, var(--line));
		transform: translateY(-2px);
	}

	.case-top {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: baseline;
	}

	.case-label {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.case-sector {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.02em;
		color: var(--ink-faint);
		text-align: right;
	}

	.case-metric {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.05rem;
		letter-spacing: -0.02em;
		color: var(--signal);
	}

	.case-result {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.12rem;
		letter-spacing: -0.02em;
		line-height: 1.25;
	}

	.case-detail {
		margin: 0;
		color: var(--ink-muted);
		font-size: 0.95rem;
		flex: 1;
	}

	.engage {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) auto;
		gap: 1.5rem;
		align-items: end;
		padding: 1.6rem 1.5rem 1.7rem;
		margin-bottom: 3rem;
		border-color: color-mix(in srgb, var(--accent) 35%, var(--line));
		background:
			linear-gradient(135deg, var(--accent-soft), transparent 55%),
			color-mix(in srgb, var(--bg-elevated) 88%, transparent);
		animation: rise 1000ms var(--ease) both;
	}

	.engage-copy h2 {
		margin: 0.45rem 0 0.75rem;
		font-size: clamp(1.35rem, 2.8vw, 1.75rem);
		max-width: 22ch;
	}

	.engage-copy p {
		margin: 0;
		color: var(--ink-muted);
		max-width: 40rem;
	}

	.engage-copy a {
		color: var(--accent);
	}

	.engage-actions {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		align-items: stretch;
		min-width: 14rem;
	}

	.proof {
		animation: rise 1100ms var(--ease) both;
	}

	.proof-lede {
		margin: -0.35rem 0 1.25rem;
		color: var(--ink-muted);
		max-width: 40rem;
		font-size: 0.98rem;
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
		font-size: 1.15rem;
		letter-spacing: -0.02em;
	}

	.summary {
		color: var(--ink-muted);
		font-size: 0.95rem;
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

	@media (max-width: 960px) {
		.case-grid {
			grid-template-columns: 1fr;
		}

		.engage {
			grid-template-columns: 1fr;
		}

		.engage-actions {
			flex-direction: row;
			flex-wrap: wrap;
			min-width: 0;
		}

		.section-aside {
			text-align: left;
		}
	}
</style>
