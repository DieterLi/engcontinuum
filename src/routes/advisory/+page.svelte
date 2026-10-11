<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/site';
</script>

<Seo
	title="Advisory"
	description="Selective architecture reviews for device, protocol, and AI-augmented delivery across the engineering continuum."
/>

<section>
	<p class="eyebrow">Selective</p>
	<h1 class="display">Advisory</h1>
	<p class="lede">
		Architecture reviews and continuum guidance for founders and hardware/software leads who need
		judgment across layers — not another pair of hands for tickets.
	</p>

	<div class="panel box">
		<h2>Good fit</h2>
		<ul>
			<li>Power-aware device + cloud products with messy control/media boundaries</li>
			<li>Protocol ownership across MCU, firmware, and ingest services</li>
			<li>AI-augmented delivery that still needs staged verification</li>
		</ul>
		<h2>How to inquire</h2>
		<p>
			Send a brief note with context, constraints, and what decision you need. No rate card on
			this page — scoping stays selective.
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

	.box {
		margin-top: 2rem;
		padding: 1.4rem 1.35rem 1.55rem;
		max-width: 40rem;
	}

	.box h2 {
		margin: 0 0 0.6rem;
		font-family: var(--font-display);
		font-size: 1.15rem;
	}

	.box h2:not(:first-child) {
		margin-top: 1.4rem;
	}

	.box ul {
		margin: 0;
		padding-left: 1.1rem;
		color: var(--ink-muted);
	}

	.box li {
		margin: 0.35rem 0;
	}

	.box p {
		color: var(--ink-muted);
		margin: 0 0 1.1rem;
	}
</style>
