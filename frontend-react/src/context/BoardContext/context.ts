import { createContext, Dispatch } from "react";
import type {
	BoardState,
	BoardAction,
} from "@/reducers/boardReducer";

export const BoardStateContext =
	createContext<BoardState | null>(null);
export const BoardDispatchContext =
	createContext<Dispatch<BoardAction> | null>(null);
