import { useState } from "react";

export const useEditableText = () => {
	const [isEditing, setIsEditing] = useState(false);

	function startEditing() {
		setIsEditing(true);
	}

	function stopEditing(fallback?: () => void) {
		if (fallback) fallback();
		setIsEditing(false);
	}

	return {
		isEditing,
		startEditing,
		stopEditing,
	};
};
