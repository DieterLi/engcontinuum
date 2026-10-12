import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE, readSessionToken } from '$lib/analytics/auth';
import type { LayoutServerLoad } from './$types';

export const prerender = false;

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const session = readSessionToken(cookies.get(SESSION_COOKIE));
	const onLogin = url.pathname === '/dashboard/login';

	if (!session && !onLogin) {
		throw redirect(303, '/dashboard/login');
	}
	if (session && onLogin) {
		throw redirect(303, '/dashboard');
	}

	return { authed: Boolean(session) };
};
