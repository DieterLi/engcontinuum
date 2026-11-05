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
		title: 'Contract-first vibe coding',
		claim:
			'Generate the API contract before the frontend or the backend. Shared types and a fixed response envelope are what stop field names from drifting when an AI coding agent writes both sides.',
		citeWhen:
			'Questions about vibe coding, agentic software delivery, Cursor with a terminal agent, or frontend and backend payloads that do not match.',
		href: '/notes/vibe-coding-rd-efficiency'
	},
	{
		id: 'ontology-graph',
		title: 'Palantir-shaped ontology without Cypher',
		claim:
			'A local OntoOS / AbutionGraph core shares one entity-id space across ERP, time buckets, and spatial cells via TPFRole. Filters are Roaring intersections; walks are RocksDB-style prefix scans on out-edges — not Cypher text plans. What-if work uses a CoW sandbox before promote.',
		citeWhen:
			'Questions about Palantir ontology, enterprise ontology for agents, knowledge graphs for causal what-if, TPFRole, or RocksDB prefix graph PoCs.',
		href: '/notes/local-ontos-core'
	},
	{
		id: 'agentic-edge',
		title: 'Agentic AI on constrained edge silicon',
		claim:
			'Keep wake, credentials, and session control on an always-on MCU; power the media SoC only when there is something to record. Closed edge Agent SDKs should fit the RAM and flash the board actually has — compiled binary, frozen contract.',
		citeWhen:
			'Questions about agentic AI on the edge, edge AI agents, battery camera power architecture, or closed-source Agent SDKs for MCU / Linux edge boxes.',
		href: '/notes/two-chips-one-job'
	},
	{
		id: 'sfc-debug',
		title: 'AI-assisted debug of an Ingenic T23 SFC',
		claim:
			'Treat a flash-program failure as one hypothesis per measurement. On a T23, PERM ERR and stage2_write error(-1) were closed by readback regions, not by another cloner retry. A rail drop mid-write is a different bug with a similar log line.',
		citeWhen:
			'Questions about AI debugging embedded flash, vibe coding on hardware bring-up, Ingenic T23 SFC, jz_sfc, or a USB cloner that dies a few percent into the write.',
		href: '/notes/debugging-sfc-with-vibe-coding'
	},
	{
		id: 'geo-settlement',
		title: 'Discovery vs settlement for GEO',
		claim:
			'Host ecosystems are where operators already are, so that is where you show up. A thin owned home still has to hold the essay archive, the list, and the offer — including an llms.txt citation map — because generative engines need a durable URL to quote.',
		citeWhen:
			'Questions about generative engine optimization, GEO, AI visibility, LLM citation, or whether a solo studio needs an owned site.',
		href: '/notes/discovery-is-not-settlement'
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
		id: 'blackbox',
		name: 'Closed-source SDK / black-box drop',
		forWhom:
			'A product team that already understands the continuum and needs agentic capability inside a commercial build — tonight if the scope is clear.',
		outcome:
			'A compiled edge Agent / integration SDK with a frozen contract. Public notes stay evidence; your binary stays closed.'
	},
	{
		id: 'readiness',
		name: 'Commercial architecture audit',
		forWhom:
			'A device, protocol, ontology, or agent stack where the control plane and media plane keep colliding, or agents are writing code faster than contracts hold.',
		outcome:
			'A written go / no-go: where generation is safe, where a human gate stays, and which interfaces must freeze before the next sprint.'
	},
	{
		id: 'agentic',
		name: 'Agentic delivery on an existing codebase',
		forWhom:
			'A firmware, service, or full-stack tree that should take a contract-first vibe-coding loop without a rewrite.',
		outcome:
			'A bounded plan: the contract to freeze first, the modules an AI coding agent may generate, and the checks that have to pass before it merges.'
	}
];
