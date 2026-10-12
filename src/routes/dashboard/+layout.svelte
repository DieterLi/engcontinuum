<script lang="ts">
	import { site } from '$lib/site';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	async function logout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		window.location.href = '/dashboard/login';
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="dash">
	<header class="bar">
		<a class="brand" href="/">{site.name}</a>
		{#if data.authed}
			<nav>
				<a href="/dashboard">Dashboard</a>
				<button type="button" onclick={logout}>Log out</button>
			</nav>
		{/if}
	</header>
	<main class="body">
		{@render children()}
	</main>
</div>

<style>
	.dash {
		min-height: 100vh;
		background:
			radial-gradient(900px 500px at 10% -10%, rgba(208, 138, 76, 0.08), transparent 55%),
			var(--bg);
	}

	.bar {
		width: min(100% - 2rem, var(--max));
		margin: 0 auto;
		min-height: 3.6rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		border-bottom: 1px solid var(--line);
	}

	.brand {
		font-family: var(--font-display);
		font-weight: 700;
		text-decoration: none;
		letter-spacing: -0.03em;
	}

	nav {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	nav a,
	nav button {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-muted);
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
		text-decoration: none;
	}

	nav a:hover,
	nav button:hover {
		color: var(--accent);
	}

	.body {
		width: min(100% - 2rem, var(--max));
		margin: 0 auto;
		padding: 2rem 0 4rem;
	}
</style>
