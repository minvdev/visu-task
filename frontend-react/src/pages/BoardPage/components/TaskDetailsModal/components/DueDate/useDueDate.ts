import { useState } from "react";

export const useDueDate = () => {
	const [isOpen, setIsOpen] = useState(false);

	return { isOpen, setIsOpen };
};
