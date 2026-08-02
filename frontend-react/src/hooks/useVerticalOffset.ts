import {
	useState,
	useLayoutEffect,
	type RefObject,
	type DependencyList,
} from "react";

/**
 * Calculates the offset between an element and the bottom edge of its container.
 *
 * @param containerRef - Reference to the container element.
 * @param elementRef - Reference to the element whose bottom offset is calculated.
 * @param deps - Dependencies that trigger the effect when they change.
 * @param padding - Extra padding from the bottom edge.
 *
 */
export const useVerticalOffset = (
	containerRef: RefObject<Element | null>,
	elementRef: RefObject<Element | null>,
	deps: DependencyList = [],
	padding = 0,
) => {
	const [offset, setOffset] = useState<number>(0);

	useLayoutEffect(() => {
		if (!elementRef.current || !containerRef.current)
			return;

		const containerRect =
			containerRef.current.getBoundingClientRect();
		const elementRect =
			elementRef.current.getBoundingClientRect();

		const distanceToBottom =
			window.innerHeight - (containerRect.bottom + padding);

		setOffset(elementRect.height - distanceToBottom);
	}, [elementRef, containerRef, ...deps]);

	return offset;
};
