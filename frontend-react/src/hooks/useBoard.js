import { useContext } from "react";
import {
	BoardStateContext,
	BoardDispatchContext,
} from "../context/BoardContext/context";

export const useBoardState = () => {
	const context = useContext(BoardStateContext);
	if (context === null) {
		throw new Error(
			"useBoardState must be used inside of a BoardProvider",
		);
	}
	return context;
};

export const useBoardDispatch = () => {
	const context = useContext(BoardDispatchContext);
	if (context === null) {
		throw new Error(
			"useBoardDispatch must be used inside of a BoardProvider",
		);
	}
	return context;
};
