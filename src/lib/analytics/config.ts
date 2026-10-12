import { env } from '$env/dynamic/private';

export const DASHBOARD_USER = env.DASHBOARD_USER || 'admin';
export const DASHBOARD_PASSWORD = env.DASHBOARD_PASSWORD || 'Mireflejo022';
export const SESSION_COOKIE = 'ec_dash_session';
export const SESSION_DAYS = 14;

export function sessionSecret(): string {
	return (
		env.DASHBOARD_SESSION_SECRET ||
		`engcontinuum:${DASHBOARD_USER}:${DASHBOARD_PASSWORD}:session-v1`
	);
}

export function hasDurableStore(): boolean {
	return Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
}
