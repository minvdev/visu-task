import { useState } from "react";
import { useBoardState } from "@hooks/useBoard";
import { useBoardActions } from "@hooks/useBoardActions";

import { VALIDATION_RULES } from "@constants/validationRules";

export const useBoard = () => {
	const board = useBoardState();
	const [name, setName] = useState(board.name);
	const { updateBoard } = useBoardActions();

	const onBoardChange = (name: string) => {
		if (
			name.length > VALIDATION_RULES.board.name.maxLength
		) {
			return;
		}
		setName(name);
	};

	const onBoardSave = (
		prevName: string,
		newName: string,
	) => {
		const formattedName = newName.trim();

		if (!formattedName) return;
		if (formattedName === prevName) return;

		updateBoard({ name: formattedName });
	};

	return {
		board,
		name,
		onBoardChange,
		onBoardSave,
	};
};
