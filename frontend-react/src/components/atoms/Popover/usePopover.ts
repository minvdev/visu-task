import {
	useState,
	useLayoutEffect,
	type RefObject,
} from "react";

const RIGHT_MARGIN = 24;

export const usePopover = (
	ref: RefObject<HTMLDivElement | null>,
	initialClass: string,
	fallbackClass: string,
) => {
	const [positionClass, setPositionClass] =
		useState(initialClass);

	useLayoutEffect(() => {
		if (!ref.current) return;

		const rect = ref.current.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		if (rect.right + RIGHT_MARGIN > viewportWidth) {
			setPositionClass(fallbackClass);
		}
	}, [fallbackClass]);

	return { positionClass };
};
