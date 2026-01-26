import { useEffect } from "react";

export const useClickOutside = (ref, handler) => {
	useEffect(() => {
		const refs = Array.isArray(ref) ? ref : [ref];
		const listener = (event) => {
			const isClickInside = refs.some(
				(ref) =>
					!ref.current ||
					ref.current.contains(event.target),
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
