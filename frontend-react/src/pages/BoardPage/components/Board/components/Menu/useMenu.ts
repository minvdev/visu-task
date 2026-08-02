import {
	useState,
	useLayoutEffect,
	type CSSProperties,
	type RefObject,
} from "react";
import { useBoardActions } from "@hooks/useBoardActions";
import { getDistanceToBorder } from "@/utils/getDistanceToBorder";

import type { components } from "@/types/open-api-schema";
export type Tag = components["schemas"]["TagSubschema"];

export type ActiveView =
	| { type: "menu" | "tags" | "create-tag" }
	| { type: "edit-tag"; tag: Tag }
	| null;

export const useMenu = (
	containerRef: RefObject<HTMLDivElement | null>,
) => {
	const { deleteBoard } = useBoardActions();

	const [isLoading, setIsLoading] = useState(false);
	const [activeView, setActiveView] =
		useState<ActiveView>(null);
	const [menuStyle, setMenuStyle] = useState<CSSProperties>(
		{},
	);

	const handleBoardDelete = async () => {
		try {
			setIsLoading(true);
			await deleteBoard();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useLayoutEffect(() => {
		if (!containerRef.current) return;
		setMenuStyle({
			"--max-form-height": `${getDistanceToBorder(containerRef, "bottom")}px`,
		} as CSSProperties);
	}, [activeView]);

	return {
		containerRef,
		menuStyle,
		activeView,
		isLoading,
		setActiveView,
		handleBoardDelete,
	};
};
