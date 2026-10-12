import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
import { SESSION_COOKIE, clearSessionCookie } from '$lib/analytics/auth';
import type { RequestHandler } from './$types';

export const prerender = false;

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.set(SESSION_COOKIE, '', clearSessionCookie(!dev));
	return json({ ok: true });
};
