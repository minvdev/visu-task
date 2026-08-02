import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { boardService } from "@services/board";
import type { BoardState } from "@/reducers/boardReducer";

export const useBoardPage = () => {
	const { boardId: boardIdParam } = useParams();
	let boardId: number | undefined;
	if (boardIdParam) boardId = parseInt(boardIdParam);

	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [initialBoard, setInitialBoard] =
		useState<BoardState | null>(null);
	const [isCompactTags, setIsCompactTags] = useState(true);

	const handleTagClick = () =>
		setIsCompactTags((prev) => !prev);

	useEffect(() => {
		setIsLoading(true);

		if (!boardId) {
			setError("Error al cargar el tablero");
			setIsLoading(false);
			return;
		}

		const fetchInitialBoard = async () => {
			const boardResponse = await boardService.getBoard({
				board_id: boardId,
			});
			const listsResponse = await boardService.getLists({
				board_id: boardId,
			});

			if (
				!boardResponse.data ||
				boardResponse.error ||
				!listsResponse.data ||
				listsResponse.error
			) {
				setError("Error al cargar el tablero");
				setIsLoading(false);
				return;
			}

			const board = {
				...boardResponse.data,
				lists: listsResponse.data,
			};
			setInitialBoard(board);
			setIsLoading(false);
		};
		fetchInitialBoard();
	}, [boardId]);

	return {
		isLoading,
		error,
		initialBoard,
		isCompactTags,
		handleTagClick,
	};
};
