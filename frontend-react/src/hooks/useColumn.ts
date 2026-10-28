import { useContext } from "react";
import { context as columnContext } from "@/context/ColumnContext/context";

export const useColumn = () => {
	const context = useContext(columnContext);
	if (context === null) {
		throw new Error(
			"useColumn must be used inside of a ColumnProvider",
		);
	}
	return context;
};
