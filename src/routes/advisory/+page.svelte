<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { engagements } from '$lib/positions';
	import { site } from '$lib/site';

	const description =
		'Two selective reviews: an AI engineering readiness review, and agentic delivery on an existing codebase. Not staffing, and not a rate card.';
</script>

<Seo title="Advisory" {description} />

<section>
	<p class="eyebrow">Selective</p>
	<h1 class="display">Advisory</h1>
	<p class="lede">
		Judgment across the path from device to agent. The work is a written review with a decision in
		it, not extra hands for a ticket queue.
	</p>

	<div class="offers">
		{#each engagements as engagement}
			<article class="panel box">
				<h2>{engagement.name}</h2>
				<p>{engagement.forWhom}</p>
				<p class="outcome">{engagement.outcome}</p>
			</article>
		{/each}
	</div>

	<div class="panel box inquire">
		<h2>Good fit</h2>
		<ul>
			<li>A device product whose control plane and media plane keep getting tangled</li>
			<li>Firmware, protocol, or service code an agent is about to rewrite without a contract</li>
			<li>A team that wants the generation loop and still wants a human gate on acceptance</li>
		</ul>
		<h2>How to inquire</h2>
		<p>
			Email the constraint, the codebase shape, and the decision you need. Scope stays selective.
			There is no public rate card.
		</p>
		<a class="btn btn-primary" href={`mailto:${site.email}?subject=Advisory%20inquiry`}
			>Email {site.email}</a
		>
	</div>
</section>

<style>
	.display {
		margin: 0.7rem 0 0.85rem;
		font-size: clamp(2.2rem, 5vw, 3.4rem);
	}

	.offers {
		margin-top: 2rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 0.9rem;
	}

	.box {
		padding: 1.4rem 1.35rem 1.55rem;
	}

	.box h2 {
		margin: 0 0 0.6rem;
		font-family: var(--font-display);
		font-size: 1.15rem;
	}

	.box h2:not(:first-child) {
		margin-top: 1.4rem;
	}

	.box p,
	.box li {
		color: var(--ink-muted);
	}

	.outcome {
		margin-bottom: 0;
	}

	.box ul {
		margin: 0;
		padding-left: 1.1rem;
	}

	.box li {
		margin: 0.35rem 0;
	}

	.inquire {
		margin-top: 0.9rem;
		max-width: 40rem;
	}

	.inquire p {
		margin: 0 0 1.1rem;
	}
</style>
