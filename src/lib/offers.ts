export type UseCase = {
	id: string;
	code: string;
	kind: string;
	metric: string;
	metricNote: string;
	title: string;
	detail: string;
	/** Public note that backs the claim. Absent when the case is a commercial deliverable. */
	source?: string;
};

/** Homepage wall. Ten-second results. Notes are evidence, linked only where a note exists. */
export const useCases: UseCase[] = [
	{
		id: 'serial-agent',
		code: 'A',
		kind: 'Bring-up',
		metric: '1 month',
		metricNote: '300% response',
		title: 'Serial hardware onto an agentic AI loop',
		detail:
			'A device manufacturer’s legacy UART path, bridged into an LLM agent in one month. The control loop answers on that path. Response time improved 300%.'
	},
	{
		id: 'edge-engine',
		code: 'B',
		kind: 'Closed-source engine',
		metric: 'MCU · Linux edge',
		metricNote: 'Compiled binary',
		title: 'An edge AI agent runtime that fits the board',
		detail:
			'A stripped agentic runtime for MCU-class parts and Linux edge boxes, built for the RAM and flash the board actually has. Shipped closed-source, as a binary.'
	},
	{
		id: 'two-chip',
		code: 'C',
		kind: 'Architecture',
		metric: 'Media asleep',
		metricNote: 'Control on the MCU',
		title: 'Edge AI power split — media SoC wakes for the frame',
		detail:
			'Battery and outdoor cameras were keeping a media chip awake for control traffic. An always-on MCU owns wake and session. The media plane powers up only when there is something to record.',
		source: '/notes/two-chips-one-job'
	}
];
