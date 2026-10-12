<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';

	let currentPath = $state('');
	let visibleStartedAt = $state(0);
	let accumulatedMs = $state(0);
	let visible = $state(true);

	function shouldTrack(pathname: string): boolean {
		return !pathname.startsWith('/dashboard') && !pathname.startsWith('/api');
	}

	function flushDwell(path: string) {
		if (!path || !shouldTrack(path)) return;
		let ms = accumulatedMs;
		if (visible && visibleStartedAt > 0) {
			ms += Date.now() - visibleStartedAt;
		}
		accumulatedMs = 0;
		visibleStartedAt = Date.now();
		if (ms < 1000) return;
		const body = JSON.stringify({ type: 'dwell', path, ms });
		if (navigator.sendBeacon) {
			navigator.sendBeacon('/api/analytics/track', new Blob([body], { type: 'application/json' }));
			return;
		}
		void fetch('/api/analytics/track', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body,
			keepalive: true
		});
	}

	function trackView(path: string) {
		if (!shouldTrack(path)) return;
		void fetch('/api/analytics/track', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type: 'view', path }),
			keepalive: true
		});
	}

	function onVisibility() {
		if (document.visibilityState === 'hidden') {
			if (visible && visibleStartedAt > 0) {
				accumulatedMs += Date.now() - visibleStartedAt;
			}
			visible = false;
			visibleStartedAt = 0;
			flushDwell(currentPath);
			return;
		}
		visible = true;
		visibleStartedAt = Date.now();
	}

	afterNavigate(() => {
		const next = page.url.pathname;
		if (currentPath && currentPath !== next) flushDwell(currentPath);
		currentPath = next;
		accumulatedMs = 0;
		visible = document.visibilityState !== 'hidden';
		visibleStartedAt = visible ? Date.now() : 0;
		trackView(next);
	});

	$effect(() => {
		const onHide = () => flushDwell(currentPath);
		document.addEventListener('visibilitychange', onVisibility);
		window.addEventListener('pagehide', onHide);
		return () => {
			document.removeEventListener('visibilitychange', onVisibility);
			window.removeEventListener('pagehide', onHide);
		};
	});
</script>
