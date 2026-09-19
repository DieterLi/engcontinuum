<script lang="ts">
	let { path = '' }: { path?: string } = $props();

	const links = [
		{ href: '/notes', label: 'Notes' },
		{ href: '/studio', label: 'Studio' },
		{ href: '/advisory', label: 'Advisory' }
	];
</script>

<header class="header">
	<div class="inner">
		<a class="brand" href="/" aria-label="EngContinuum home">
			<span class="mark" aria-hidden="true"></span>
			<span class="word">EngContinuum</span>
		</a>
		<nav class="nav" aria-label="Primary">
			{#each links as link}
				<a
					href={link.href}
					class:active={path === link.href || path.startsWith(link.href + '/')}
				>
					{link.label}
				</a>
			{/each}
		</nav>
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 20;
		backdrop-filter: blur(14px);
		background: color-mix(in srgb, var(--bg) 78%, transparent);
		border-bottom: 1px solid var(--line);
	}

	.inner {
		width: min(100% - 2rem, var(--max));
		margin: 0 auto;
		min-height: 4rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		text-decoration: none;
		color: var(--ink);
	}

	.brand:hover {
		color: var(--ink);
	}

	.mark {
		width: 0.85rem;
		height: 0.85rem;
		background: var(--accent);
		border-radius: 1px;
		box-shadow: 4px 4px 0 0 color-mix(in srgb, var(--signal) 70%, transparent);
	}

	.word {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.05rem;
		letter-spacing: -0.03em;
	}

	.nav {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.nav a {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--ink-muted);
		padding: 0.45rem 0.7rem;
		border-radius: var(--radius);
	}

	.nav a:hover,
	.nav a.active {
		color: var(--ink);
		background: var(--accent-soft);
	}
</style>
