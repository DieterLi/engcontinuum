import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
import {
	SESSION_COOKIE,
	createSessionToken,
	sessionCookieOptions,
	verifyCredentials
} from '$lib/analytics/auth';
import type { RequestHandler } from './$types';

export const prerender = false;

export const POST: RequestHandler = async ({ request, cookies }) => {
	let body: { username?: string; password?: string };
	try {
		body = (await request.json()) as { username?: string; password?: string };
	} catch {
		return json({ ok: false, error: 'Invalid body' }, { status: 400 });
	}

	const username = typeof body.username === 'string' ? body.username : '';
	const password = typeof body.password === 'string' ? body.password : '';
	if (!verifyCredentials(username, password)) {
		return json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
	}

	const token = createSessionToken();
	cookies.set(SESSION_COOKIE, token, sessionCookieOptions(token, !dev));
	return json({ ok: true });
};
