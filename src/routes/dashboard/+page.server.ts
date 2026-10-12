import { getDashboardStats } from '$lib/analytics/store';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async () => {
	return { stats: await getDashboardStats() };
};
