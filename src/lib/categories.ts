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
		description: 'Architecture judgment across the continuum.'
	},
	practice: {
		id: 'practice',
		label: 'Practice',
		description: 'Vibe Coding workflows and AI-assisted delivery leverage.'
	}
} as const;

export const categoryList = Object.values(categories);

export function resolveCategory(id?: string): Category {
	if (id && id in categories) return categories[id as CategoryId];
	return categories.notes;
}
