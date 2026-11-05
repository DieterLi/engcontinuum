export type UseCase = {
	id: string;
	label: string;
	sector: string;
	result: string;
	metric: string;
	detail: string;
};

/** Ten-second commercial wall — outcomes, not notes. */
export const useCases: UseCase[] = [
	{
		id: 'serial-to-agent',
		label: 'Case A',
		sector: 'Device OEM · serial stack',
		result: 'Traditional UART / Modbus hardware wired into an agentic AI control loop.',
		metric: '1 month · +300% response speed',
		detail:
			'Protocol adapters, tool contracts, and acceptance gates so operators talk to equipment in natural language — without rewriting the field bus.'
	},
	{
		id: 'edge-agent-runtime',
		label: 'Case B',
		sector: 'MCU / Linux edge box',
		result: 'Edge AI agent runtime on extreme-constraint silicon — closed, slim, shippable.',
		metric: 'Closed-source edge engine',
		detail:
			'A stripped agentic core for flash- and RAM-poor boards: compile-time budgets, host-testable I/O, no open-source license bleed into your product.'
	},
	{
		id: 'blackbox-delivery',
		label: 'Case C',
		sector: 'Commercial IP · overnight drop',
		result: 'Agentic architecture audit that lands as a compiled black box — not a slide deck.',
		metric: 'Same-day binary when scoped',
		detail:
			'You get the capability inside your commercial project: signed SDK / Agent binary, integration contract, and a written go / no-go on what stays human.'
	}
];
