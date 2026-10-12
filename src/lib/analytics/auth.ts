import { createHmac, timingSafeEqual } from 'node:crypto';
import { DASHBOARD_PASSWORD, DASHBOARD_USER, SESSION_COOKIE, SESSION_DAYS, sessionSecret } from './config';

type SessionPayload = {
	u: string;
	exp: number;
};

function b64url(input: string | Buffer): string {
	return Buffer.from(input)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/g, '');
}

function fromB64url(input: string): Buffer {
	const padded = input.replace(/-/g, '+').replace(/_/g, '/');
	const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
	return Buffer.from(padded + pad, 'base64');
}

function sign(payload: string): string {
	return createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
}

export function verifyCredentials(username: string, password: string): boolean {
	const userOk =
		username.length === DASHBOARD_USER.length &&
		timingSafeEqual(Buffer.from(username), Buffer.from(DASHBOARD_USER));
	const passOk =
		password.length === DASHBOARD_PASSWORD.length &&
		timingSafeEqual(Buffer.from(password), Buffer.from(DASHBOARD_PASSWORD));
	return userOk && passOk;
}

export function createSessionToken(): string {
	const payload: SessionPayload = {
		u: DASHBOARD_USER,
		exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
	};
	const body = b64url(JSON.stringify(payload));
	return `${body}.${sign(body)}`;
}

export function readSessionToken(token: string | undefined): SessionPayload | null {
	if (!token) return null;
	const [body, sig] = token.split('.');
	if (!body || !sig) return null;
	const expected = sign(body);
	const a = Buffer.from(sig);
	const b = Buffer.from(expected);
	if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
	try {
		const payload = JSON.parse(fromB64url(body).toString('utf8')) as SessionPayload;
		if (payload.u !== DASHBOARD_USER || typeof payload.exp !== 'number') return null;
		if (payload.exp < Date.now()) return null;
		return payload;
	} catch {
		return null;
	}
}

export function sessionCookieOptions(token: string, secure = true) {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax' as const,
		secure,
		maxAge: SESSION_DAYS * 24 * 60 * 60,
		value: token
	};
}

export function clearSessionCookie(secure = true) {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax' as const,
		secure,
		maxAge: 0,
		value: ''
	};
}

export { SESSION_COOKIE };
