import { siteTopicSentence } from './topics';

export const site = {
	name: 'EngContinuum',
	url: 'https://engcontinuum.com',
	tagline: 'Agentic AI assurance from device to agent.',
	description: `Closed-source edge Agent SDKs, commercial architecture audits, and ontology-backed agent loops for teams shipping hardware-to-LLM systems. ${siteTopicSentence} Field notes are evidence, not the product.`,
	author: 'Dieter Li',
	github: 'https://github.com/dieterli',
	email: 'popeyun@gmail.com',
	engageMailto: `mailto:popeyun@gmail.com?subject=${encodeURIComponent('EngContinuum — closed SDK / architecture audit')}&body=${encodeURIComponent(
		[
			'What I need (pick one or more):',
			'[ ] Closed-source edge Agent SDK / compiled black box',
			'[ ] Commercial architecture audit (device → agent / ontology)',
			'[ ] Agentic delivery plan on an existing codebase',
			'[ ] Custom integration on existing serial / MCU / Linux edge stack',
			'',
			'Constraint / timeline:',
			'Hardware / stack shape:',
			'Decision I need this week:'
		].join('\n')
	)}`
} as const;
