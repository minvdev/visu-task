import { tagColors } from "@constants/tagColors";

import type { components } from "@/types/open-api-schema";
type TagSubschema = components["schemas"]["TagSubschema"];

export function resolveTagColors(tag: TagSubschema) {
	const matchingColorOption = tagColors.find(
		(colorOption) =>
			colorOption.backgroundColor === tag.color,
	) || {
		color: "#000",
		backgroundColor: tag.color,
	};
	return {
		...tag,
		color: matchingColorOption.color,
		backgroundColor: matchingColorOption.backgroundColor,
	};
}
