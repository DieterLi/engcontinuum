<script lang="ts">
	import { site } from '$lib/site';
</script>

<svelte:head>
	<title>Studio — {site.name}</title>
	<meta
		name="description"
		content="A one-person systems studio spanning hardware to AI agents."
	/>
</svelte:head>

<section>
	<p class="eyebrow">Studio</p>
	<h1 class="display">A practice across the continuum</h1>
	<p class="lede">
		EngContinuum is the public workshop of {site.author}: end-to-end systems judgment from device
		and firmware through protocols, services, and agent loops — operated as a one-person studio
		with AI leverage.
	</p>

	<div class="grid">
		<article class="panel card">
			<h2>What this is</h2>
			<p>
				An owned settlement layer for notes, frameworks, and selective advisory — not a cold
				landing page chasing ads. Discovery happens where operators already work; this site is
				where trust and offers close.
			</p>
		</article>
		<article class="panel card">
			<h2>How work happens</h2>
			<p>
				Staged bring-up, host-testable protocols, and verification gates. AI accelerates
				execution; architecture and acceptance criteria stay human.
			</p>
		</article>
		<article class="panel card">
			<h2>What we do not do</h2>
			<p>
				Volume freelancing, beginner tutorial mills, or broadcasting “open to work.” Exceptional
				remote roles remain a private option when terms beat independent leverage.
			</p>
		</article>
	</div>
</section>

<style>
	.display {
		margin: 0.7rem 0 0.85rem;
		font-size: clamp(2.1rem, 5vw, 3.3rem);
		max-width: 14ch;
	}

	.grid {
		margin-top: 2.2rem;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.9rem;
	}

	.card {
		padding: 1.2rem 1.2rem 1.3rem;
	}

	.card h2 {
		margin: 0 0 0.55rem;
		font-family: var(--font-display);
		font-size: 1.15rem;
		letter-spacing: -0.02em;
	}

	.card p {
		margin: 0;
		color: var(--ink-muted);
		font-size: 0.98rem;
	}

	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
