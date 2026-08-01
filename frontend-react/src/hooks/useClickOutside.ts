import React, { useEffect } from "react";

type ClickOutsideRef = React.RefObject<Element | null>;

type HandleEvents = Event;

export const useClickOutside = (
	ref: ClickOutsideRef | ClickOutsideRef[],
	handler: (e: HandleEvents) => void,
) => {
	useEffect(() => {
		const refs = Array.isArray(ref) ? ref : [ref];
		const listener = (event: HandleEvents) => {
			const isClickInside = refs.some(
				(ref) =>
					!ref.current ||
					ref.current.contains(event.target as Node),
			);

			if (isClickInside) {
				return;
			}

			handler(event);
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, handler]);
};
