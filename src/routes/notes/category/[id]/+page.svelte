<script lang="ts">
	import NotesIndex from '$lib/components/NotesIndex.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<NotesIndex posts={data.posts} category={data.category} />
