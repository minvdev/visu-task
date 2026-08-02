import { tagColors } from "@constants/tagColors";
import type { TagProps } from "./Tag";

export const useTag = () => {
	function resolveTagColors(tag: TagProps["tag"]) {
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

	return {
		resolveTagColors,
	};
};
