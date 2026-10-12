import { json } from '@sveltejs/kit';
import { recordDwell, recordView } from '$lib/analytics/store';
import type { RequestHandler } from './$types';

export const prerender = false;

type TrackBody = {
	type?: string;
	path?: string;
	ms?: number;
};

export const POST: RequestHandler = async ({ request }) => {
	let body: TrackBody;
	try {
		const text = await request.text();
		body = JSON.parse(text) as TrackBody;
	} catch {
		return json({ ok: false }, { status: 400 });
	}

	const path = typeof body.path === 'string' ? body.path : '';
	try {
		if (body.type === 'view') {
			await recordView(path);
			return json({ ok: true });
		}
		if (body.type === 'dwell') {
			await recordDwell(path, Number(body.ms) || 0);
			return json({ ok: true });
		}
	} catch (error) {
		console.error('analytics track failed', error);
		return json({ ok: false }, { status: 500 });
	}

	return json({ ok: false }, { status: 400 });
};
