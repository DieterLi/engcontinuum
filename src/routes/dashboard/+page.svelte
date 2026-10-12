<script lang="ts">
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const stats = $derived(data.stats);

	function formatDuration(sec: number): string {
		if (sec <= 0) return '—';
		if (sec < 60) return `${sec}s`;
		const m = Math.floor(sec / 60);
		const s = sec % 60;
		return `${m}m ${s}s`;
	}
</script>

<svelte:head>
	<title>Dashboard — {site.name}</title>
</svelte:head>

<section>
	<p class="eyebrow">Analytics</p>
	<h1 class="display">Traffic</h1>
	<p class="lede">
		Views across the site, and dwell time on note pages. Updated
		{new Date(stats.updatedAt).toLocaleString()}.
	</p>

	{#if !stats.durable}
		<p class="warn panel">
			Storage is local to this server instance. On Vercel, set
			<code>UPSTASH_REDIS_REST_URL</code> and <code>UPSTASH_REDIS_REST_TOKEN</code> for durable
			stats across cold starts.
		</p>
	{/if}

	<div class="metrics">
		<article class="panel metric">
			<p class="kicker">Total views</p>
			<p class="value">{stats.totalViews}</p>
		</article>
		<article class="panel metric">
			<p class="kicker">Views today</p>
			<p class="value">{stats.viewsToday}</p>
		</article>
		<article class="panel metric">
			<p class="kicker">Tracked paths</p>
			<p class="value">{stats.pageCount}</p>
		</article>
		<article class="panel metric">
			<p class="kicker">Avg article dwell</p>
			<p class="value">{formatDuration(stats.avgArticleDwellSec)}</p>
		</article>
	</div>

	<div class="table-wrap panel">
		<table>
			<thead>
				<tr>
					<th>Path</th>
					<th>Views</th>
					<th>Avg dwell</th>
					<th>Samples</th>
				</tr>
			</thead>
			<tbody>
				{#each stats.pages as row}
					<tr class:article={row.isArticle}>
						<td>
							<a href={row.path}>{row.path}</a>
							{#if row.isArticle}
								<span class="tag">article</span>
							{/if}
						</td>
						<td>{row.views}</td>
						<td>{formatDuration(row.avgDwellSec)}</td>
						<td>{row.dwellSamples || '—'}</td>
					</tr>
				{:else}
					<tr>
						<td colspan="4">No traffic recorded yet. Browse the site, then refresh.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<style>
	.display {
		margin: 0.55rem 0 0.7rem;
		font-size: clamp(2rem, 5vw, 3rem);
	}

	.warn {
		margin: 1.2rem 0 0;
		padding: 0.9rem 1rem;
		color: var(--ink-muted);
		font-size: 0.95rem;
	}

	.warn code {
		font-family: var(--font-mono);
		font-size: 0.82em;
		color: var(--signal);
	}

	.metrics {
		margin-top: 1.6rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		gap: 0.75rem;
	}

	.metric {
		padding: 1rem 1.05rem;
	}

	.kicker {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}

	.value {
		margin: 0.45rem 0 0;
		font-family: var(--font-display);
		font-size: 1.7rem;
		font-weight: 700;
		letter-spacing: -0.03em;
	}

	.table-wrap {
		margin-top: 1.2rem;
		padding: 0;
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
	}

	th,
	td {
		text-align: left;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--line);
		vertical-align: top;
	}

	th {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}

	td a {
		text-decoration: none;
		color: var(--ink);
	}

	td a:hover {
		color: var(--accent);
	}

	.tag {
		margin-left: 0.45rem;
		font-family: var(--font-mono);
		font-size: 0.65rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--signal);
		border: 1px solid color-mix(in srgb, var(--signal) 35%, transparent);
		padding: 0.1rem 0.3rem;
		border-radius: 2px;
	}

	tr.article td:first-child a {
		font-family: var(--font-display);
		font-weight: 600;
	}
</style>
