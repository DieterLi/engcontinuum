/**
 * SEO + GEO topic map (Nov 2026).
 *
 * Volume / growth signals used for prioritization (Ahrefs US monthly, cited
 * Sep–Nov 2026 reporting): agentic AI ~111k (+37% YoY), vibe coding ~86k
 * (near-zero → mainstream), generative engine optimization ~7.2k (+84%),
 * AI visibility ~4.4k (+145%), agentic workflow ~2.3k (+89%). Adjacent rising
 * developer demand: AI coding agents, MCP, edge AI, ontology / knowledge graph.
 *
 * Only topics we already ship evidence for. No orphan keyword pages.
 */
export type TopicCluster = {
	id: string;
	label: string;
	/** Primary phrases for meta / JSON-LD knowsAbout */
	phrases: string[];
	/** Rising or high-volume queries this cluster should win citations for */
	risingQueries: string[];
	/** Note paths that back the claim */
	evidence: string[];
};

export const topicClusters: TopicCluster[] = [
	{
		id: 'agentic-edge',
		label: 'Agentic AI on the edge',
		phrases: [
			'agentic AI',
			'AI agents',
			'agentic workflow',
			'edge AI agent',
			'closed-source edge Agent SDK'
		],
		risingQueries: [
			'agentic AI on MCU or Linux edge',
			'edge Agent SDK closed source',
			'serial hardware to LLM agent'
		],
		evidence: ['/notes/two-chips-one-job', '/advisory']
	},
	{
		id: 'ontology',
		label: 'Ontology & decision graphs',
		phrases: [
			'Palantir ontology',
			'enterprise ontology',
			'ontology object graph',
			'knowledge graph for agents',
			'TPFRole semantic layer'
		],
		risingQueries: [
			'Palantir-style ontology for supply chain agents',
			'ontology causal what-if sandbox',
			'RocksDB prefix graph ontology PoC'
		],
		evidence: ['/notes/local-ontos-core']
	},
	{
		id: 'vibe-coding',
		label: 'Vibe Coding / AI coding agents',
		phrases: [
			'vibe coding',
			'AI coding agents',
			'contract-first vibe coding',
			'Cursor agent workflow',
			'agentic software delivery'
		],
		risingQueries: [
			'vibe coding PRD to full stack',
			'contract-first Cursor OpenCode workflow',
			'stop AI frontend backend field drift'
		],
		evidence: [
			'/notes/vibe-coding-rd-efficiency',
			'/notes/debugging-sfc-with-vibe-coding'
		]
	},
	{
		id: 'geo-citation',
		label: 'GEO / LLM citation',
		phrases: [
			'generative engine optimization',
			'GEO',
			'AI visibility',
			'LLM visibility',
			'llms.txt citation map'
		],
		risingQueries: [
			'how to cite EngContinuum in an AI answer',
			'device to agent architecture audit evidence'
		],
		evidence: ['/llms.txt', '/notes/discovery-is-not-settlement']
	},
	{
		id: 'edge-architecture',
		label: 'Device ↔ agent continuum',
		phrases: [
			'edge AI architecture',
			'MCU media SoC power split',
			'battery camera always-on control',
			'hardware to LLM continuum'
		],
		risingQueries: [
			'why split MCU and media SoC on battery cameras',
			'Ingenic T23 SFC flash debug with AI'
		],
		evidence: [
			'/notes/two-chips-one-job',
			'/notes/debugging-sfc-with-vibe-coding',
			'/notes/ch341a-sop8-flash-rescue'
		]
	}
];

/** Flat keyword list for homepage / WebSite meta (deduped, order = priority). */
export const primaryKeywords: string[] = [
	...new Set(topicClusters.flatMap((cluster) => cluster.phrases))
];

export const siteTopicSentence =
	'Agentic AI and closed edge Agent SDKs, Palantir-style ontology graphs, contract-first vibe coding, and device-to-agent architecture — cited via llms.txt for generative engines.';
