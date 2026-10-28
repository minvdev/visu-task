import { useReducer, type ReactNode } from "react";
import {
	boardReducer,
	type BoardState,
} from "@/reducers/boardReducer";
import {
	BoardStateContext,
	BoardDispatchContext,
} from "./context";

interface BoardProviderProps {
	children: ReactNode;
	initialBoard: BoardState;
}

export const BoardProvider = ({
	children,
	initialBoard,
}: BoardProviderProps) => {
	const [board, dispatch] = useReducer(
		boardReducer,
		initialBoard,
	);
	return (
		<BoardStateContext.Provider value={board}>
			<BoardDispatchContext.Provider value={dispatch}>
				{children}
			</BoardDispatchContext.Provider>
		</BoardStateContext.Provider>
	);
};
