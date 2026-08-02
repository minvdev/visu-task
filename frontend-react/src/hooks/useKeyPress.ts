import { useEffect, useRef } from "react";

export const useKeyPress = (
	key: KeyboardEvent["key"],
	handler: (e: globalThis.KeyboardEvent) => void,
) => {
	const handlerRef = useRef(handler);
	handlerRef.current = handler;

	useEffect(() => {
		const listener = (event: globalThis.KeyboardEvent) => {
			if (event.key === key) {
				handlerRef.current(event);
			}
		};

		document.addEventListener("keydown", listener);

		return () => {
			document.removeEventListener("keydown", listener);
		};
	}, [key]);
};
