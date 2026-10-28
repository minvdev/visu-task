import { type RefObject } from "react";
import { NAVBAR_HEIGHT } from "@/constants/layout";

/**
 * Calculates the distance between an element and a viewport edge.
 *
 * @param ref - Reference to the target element.
 * @param side - Viewport edge to measure from. Defaults to `"bottom"`.
 * @param padding - Additional padding, in pixels.
 *
 * If `side` is `"top"`, the top navigation bar height is added to this value.
 *
 * @returns The Distance, in pixels, between the element and the specified viewport edge.
 */
export function getDistanceToBorder(
	ref: RefObject<Element | null>,
	side: "left" | "top" | "right" | "bottom" = "bottom",
	padding = 0,
): number {
	if (!ref.current) return 0;
	const rect = ref.current.getBoundingClientRect();

	switch (side) {
		case "left":
			return rect.left - padding;
		case "top":
			return rect.top - (padding + NAVBAR_HEIGHT);
		case "right":
			return window.innerWidth - (rect.right + padding);
		case "bottom":
			return window.innerHeight - (rect.bottom + padding);
	}
}
