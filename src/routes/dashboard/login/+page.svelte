<script lang="ts">
	import { site } from '$lib/site';

	let username = $state('admin');
	let password = $state('');
	let error = $state('');
	let pending = $state(false);

	async function submit(event: Event) {
		event.preventDefault();
		pending = true;
		error = '';
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});
			if (!res.ok) {
				error = 'Invalid username or password.';
				return;
			}
			window.location.href = '/dashboard';
		} catch {
			error = 'Login failed. Try again.';
		} finally {
			pending = false;
		}
	}
</script>

<svelte:head>
	<title>Dashboard login — {site.name}</title>
</svelte:head>

<section class="wrap">
	<p class="eyebrow">Private</p>
	<h1 class="display">Dashboard</h1>
	<p class="lede">Page views and article dwell time. Sign in to continue.</p>

	<form class="panel form" onsubmit={submit}>
		<label>
			<span>Username</span>
			<input bind:value={username} name="username" autocomplete="username" required />
		</label>
		<label>
			<span>Password</span>
			<input
				bind:value={password}
				name="password"
				type="password"
				autocomplete="current-password"
				required
			/>
		</label>
		{#if error}
			<p class="error">{error}</p>
		{/if}
		<button class="btn btn-primary" type="submit" disabled={pending}>
			{pending ? 'Signing in…' : 'Sign in'}
		</button>
	</form>
</section>

<style>
	.wrap {
		max-width: 26rem;
	}

	.display {
		margin: 0.55rem 0 0.7rem;
		font-size: clamp(2rem, 5vw, 2.8rem);
	}

	.form {
		margin-top: 1.6rem;
		padding: 1.25rem 1.2rem;
		display: grid;
		gap: 0.9rem;
	}

	label {
		display: grid;
		gap: 0.35rem;
	}

	label span {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}

	input {
		width: 100%;
		box-sizing: border-box;
		padding: 0.7rem 0.75rem;
		border: 1px solid var(--line);
		border-radius: 2px;
		background: var(--bg-elevated);
		color: var(--ink);
		font: inherit;
	}

	input:focus {
		outline: 1px solid var(--accent);
		border-color: var(--accent);
	}

	.error {
		margin: 0;
		color: var(--danger);
		font-size: 0.92rem;
	}
</style>
