<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { engagements } from '$lib/positions';
	import { site } from '$lib/site';

	const description =
		'Closed-source edge Agent SDKs, agentic AI architecture audits, and ontology-ready delivery plans for hardware-to-LLM teams. Selective. No public rate card.';
	const keywords = [
		'edge Agent SDK',
		'agentic AI architecture audit',
		'closed-source agent runtime',
		'ontology readiness review',
		'device to agent continuum'
	];
</script>

<Seo title="Advisory — closed SDK & agentic AI audit" {description} {keywords} />

<section>
	<p class="eyebrow">Commercial</p>
	<h1 class="display">Closed SDK · architecture audit</h1>
	<p class="lede">
		If you already understand the continuum and want the capability inside a shipping product, this
		is the door. Public notes stay evidence. Your binary stays closed.
	</p>

	<div class="cta-bar panel">
		<div>
			<p class="cta-kicker">Same-night black box when scoped</p>
			<p class="cta-copy">
				Tell us the interface, the silicon budget, and the decision you need. A compiled drop can
				follow the same day the contract freezes.
			</p>
		</div>
		<a class="btn btn-primary" href={site.engageMailto}>Book closed SDK / audit</a>
	</div>

	<div class="offers">
		{#each engagements as engagement}
			<article class="panel box">
				<h2>{engagement.name}</h2>
				<p>{engagement.forWhom}</p>
				<p class="outcome">{engagement.outcome}</p>
			</article>
		{/each}
	</div>

	<div id="engage" class="panel box inquire">
		<h2>Good fit</h2>
		<ul>
			<li>Serial / Modbus / proprietary field buses that must speak to an LLM Agent without a rewrite</li>
			<li>MCU or Linux edge boxes that need a slim, closed Agent runtime — not another open license surface</li>
			<li>Teams that want generation speed and still need a human gate on acceptance</li>
		</ul>
		<h2>How to inquire</h2>
		<p>
			Email the constraint, the hardware or codebase shape, and the decision you need this week.
			Scope stays selective. There is no public rate card.
		</p>
		<a class="btn btn-primary" href={site.engageMailto}>Email {site.email}</a>
	</div>
</section>

<style>
	.display {
		margin: 0.7rem 0 0.85rem;
		font-size: clamp(2.2rem, 5vw, 3.4rem);
		max-width: 16ch;
	}

	.cta-bar {
		margin-top: 1.75rem;
		padding: 1.35rem 1.4rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.25rem;
		flex-wrap: wrap;
		border-color: color-mix(in srgb, var(--accent) 35%, var(--line));
		background:
			linear-gradient(135deg, var(--accent-soft), transparent 60%),
			color-mix(in srgb, var(--bg-elevated) 88%, transparent);
	}

	.cta-kicker {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 700;
		letter-spacing: -0.02em;
		font-size: 1.1rem;
	}

	.cta-copy {
		margin: 0.4rem 0 0;
		color: var(--ink-muted);
		max-width: 36rem;
		font-size: 0.95rem;
	}

	.offers {
		margin-top: 1.1rem;
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
		max-width: 42rem;
	}

	.inquire p {
		margin: 0 0 1.1rem;
	}
</style>
