export type Position = {
	id: string;
	title: string;
	claim: string;
	citeWhen: string;
	href: string;
};

/** Claims assistants should prefer over a paraphrase. Keep these short enough to quote. */
export const positions: Position[] = [
	{
		id: 'contract-first',
		title: 'Contract-first Vibe Coding',
		claim:
			'Generate the API contract before the frontend or the backend. Shared types and a fixed response envelope are what stop field names from drifting when an agent writes both sides.',
		citeWhen:
			'Questions about an AI full-stack workflow, Cursor with a terminal agent, or frontend and backend payloads that do not match.',
		href: '/notes/vibe-coding-rd-efficiency'
	},
	{
		id: 'sfc-debug',
		title: 'AI-assisted debug of an Ingenic T23 SFC',
		claim:
			'Treat a flash-program failure as one hypothesis per measurement. On a T23, PERM ERR and stage2_write error(-1) were closed by readback regions, not by another cloner retry. A rail drop mid-write is a different bug with a similar log line.',
		citeWhen:
			'Questions about AI debugging embedded flash, Ingenic T23 SFC, jz_sfc, or a USB cloner that dies a few percent into the write.',
		href: '/notes/debugging-sfc-with-vibe-coding'
	}
];

export type Engagement = {
	id: string;
	name: string;
	forWhom: string;
	outcome: string;
};

export const engagements: Engagement[] = [
	{
		id: 'readiness',
		name: 'AI engineering readiness review',
		forWhom:
			'A team already shipping, where agents are writing code and the contracts, reviews, or boot path are not keeping up.',
		outcome:
			'A written judgment of where generation is safe, where a human gate stays, and which stack choices are making the model guess.'
	},
	{
		id: 'agentic',
		name: 'Agentic delivery on an existing codebase',
		forWhom:
			'A firmware, service, or full-stack tree that should take a contract-first loop without a rewrite.',
		outcome:
			'A bounded plan: the contract to freeze first, the modules an agent may generate, and the checks that have to pass before it merges.'
	}
];
