import { useReducer } from "react";
import { boardReducer } from "../../reducers/boardReducer";
import {
	BoardStateContext,
	BoardDispatchContext,
} from "./context";

export const BoardProvider = ({
	children,
	initialBoard,
}) => {
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
