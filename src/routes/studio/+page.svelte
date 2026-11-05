<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/site';

	const description =
		'A one-person assurance studio for agentic AI from hardware to agent loops — closed edge SDKs and architecture audits in front, ontology and vibe-coding field notes as GEO evidence behind.';
	const keywords = [
		'agentic AI studio',
		'edge AI assurance',
		'vibe coding practice',
		'ontology field notes',
		'device to agent continuum'
	];
</script>

<Seo title="Studio — device to agentic AI" {description} {keywords} />

<section>
	<p class="eyebrow">Studio</p>
	<h1 class="display">Assurance across the continuum</h1>
	<p class="lede">
		EngContinuum is the practice of {site.author}: end-to-end judgment from device and firmware
		through protocols, services, and agent loops — sold as closed capability, documented as field
		evidence.
	</p>

	<div class="grid">
		<article class="panel card">
			<h2>What this is</h2>
			<p>
				A settlement layer for commercial drops and selective audits. Notes and
				<a href="/llms.txt">llms.txt</a> earn peer and agent trust; the product is a compiled
				black box or a written go / no-go — not another open tutorial mill.
			</p>
		</article>
		<article class="panel card">
			<h2>How work happens</h2>
			<p>
				Staged bring-up, host-testable protocols, and verification gates. AI accelerates
				execution; architecture and acceptance criteria stay human. The delivery loop is written
				up as a
				<a href="/notes/vibe-coding-rd-efficiency">Vibe Coding workflow from PRD to a running stack</a>.
			</p>
		</article>
		<article class="panel card">
			<h2>Front door vs backstage</h2>
			<p>
				Buyers start at
				<a href="/advisory">closed SDK / architecture audit</a>. Peers and agents read the
				notes. Experiments that should stay public live on
				<a href={site.github} rel="noreferrer" target="_blank">GitHub</a>.
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
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
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

	.card a {
		color: var(--accent);
	}
</style>
