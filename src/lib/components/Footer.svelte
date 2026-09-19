<script lang="ts">
	import { site } from '$lib/site';
</script>

<footer class="footer">
	<div class="inner">
		<div>
			<p class="brand">{site.name}</p>
			<p class="copy">{site.tagline}</p>
		</div>
		<div class="links">
			<a href="/notes">Notes</a>
			<a href="/studio">Studio</a>
			<a href="/advisory">Advisory</a>
			<a href={site.github} rel="noreferrer" target="_blank">GitHub</a>
		</div>
	</div>
</footer>

<style>
	.footer {
		border-top: 1px solid var(--line);
		padding: 2rem 0 2.5rem;
	}

	.inner {
		width: min(100% - 2rem, var(--max));
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.brand {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.copy {
		margin: 0.35rem 0 0;
		color: var(--ink-faint);
		font-size: 0.95rem;
		max-width: 28rem;
	}

	.links {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		align-items: flex-start;
	}

	.links a {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		text-decoration: none;
		color: var(--ink-muted);
	}

	.links a:hover {
		color: var(--accent);
	}
</style>
