import { ReactNode } from "react";
import { context, type ColumnState } from "./context";

export interface ColumnProviderProps {
	children: ReactNode;
	initialValue: ColumnState;
}

export const ColumnProvider = ({
	children,
	initialValue,
}: ColumnProviderProps) => {
	return (
		<context.Provider value={initialValue}>
			{children}
		</context.Provider>
	);
};
