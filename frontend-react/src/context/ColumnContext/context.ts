import { createContext } from "react";
import type { BoardState } from "@/reducers/boardReducer";
export type ColumnState = BoardState["lists"][number];

export const context = createContext<ColumnState | null>(
	null,
);
