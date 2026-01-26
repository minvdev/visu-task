import { useEffect } from "react";

export const useKeyPress = (
	targetKey,
	isActive = true,
	handler
) => {
	useEffect(() => {
		if (!isActive) return;

		const listener = (event) => {
			if (event.key === targetKey) {
				handler(event);
			}
		};

		document.addEventListener("keydown", listener);

		return () => {
			document.removeEventListener("keydown", listener);
		};
	}, [handler, targetKey, isActive]);
};
