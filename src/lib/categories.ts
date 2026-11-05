export type CategoryId = 'notes' | 'practice';

export type Category = {
	id: CategoryId;
	label: string;
	description: string;
};

export const categories: Record<CategoryId, Category> = {
	notes: {
		id: 'notes',
		label: 'Notes',
		description:
			'Architecture judgment across the continuum: edge AI, Palantir-style ontology graphs, MCU/SoC power splits, and device-to-agent boundaries.'
	},
	practice: {
		id: 'practice',
		label: 'Practice',
		description:
			'Vibe coding and AI coding-agent workflows — contract-first delivery from a PRD to a running stack, including hardware bring-up loops.'
	}
} as const;

export const categoryList = Object.values(categories);

export function resolveCategory(id?: string): Category {
	if (id && id in categories) return categories[id as CategoryId];
	return categories.notes;
}

export function categoryPath(id: CategoryId | 'all'): string {
	if (id === 'all') return '/notes';
	return `/notes/category/${id}`;
}
