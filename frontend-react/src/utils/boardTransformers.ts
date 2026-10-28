import type { components } from "@/types/open-api-schema";

export const toCardSubschema = (
	card: components["schemas"]["Card"],
): components["schemas"]["CardSubschema"] => ({
	id: card.id,
	name: card.name,
	text: card.text ?? null,
	is_done: card.is_done,
	position: card.position,
	due_date: card.due_date ?? null,
	tags: card.tags,
});

export const toTagSubschema = (
	tag: components["schemas"]["Tag"],
): components["schemas"]["TagSubschema"] => ({
	id: tag.id,
	name: tag.name ?? null,
	color: tag.color,
});
