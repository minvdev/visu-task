import {
	DependencyList,
	type RefObject,
	useEffect,
} from "react";

export function useScrollTo(
	ref: RefObject<HTMLElement | null>,
	options: ScrollToOptions,
	trigger: DependencyList = [],
	conditions: boolean | boolean[] = [],
) {
	useEffect(() => {
		if (!ref.current) return;
		if (
			!(
				Array.isArray(conditions)
					? [...conditions]
					: [conditions]
			).every((condition) => condition && true)
		)
			return;

		console.log("useScrollTo");

		ref.current.scrollTo(options);
	}, [...trigger]);
}
