import { useState, useRef, type MouseEvent } from "react";
import { useColumnActions } from "@hooks/useColumnActions";
import type { TaskProps } from "./Task";

type ActiveView = "edit-name" | "show-details" | "none";

export const useTask = (task: TaskProps["task"]) => {
	const { updateTask } = useColumnActions();

	const [isLoading, setIsLoading] = useState(false);
	const [activeView, setActiveView] =
		useState<ActiveView>("edit-name");

	const taskRef = useRef<HTMLDivElement>(null);
	const [taskRect, setTaskRect] = useState<DOMRect | null>(
		null,
	);

	const handleEditClick = (
		e: MouseEvent<HTMLButtonElement>,
	) => {
		e.stopPropagation();
		if (taskRef.current) {
			setTaskRect(taskRef.current.getBoundingClientRect());
			setActiveView("edit-name");
		}
	};

	const handleToggleComplete = async (
		e: MouseEvent<HTMLButtonElement>,
	) => {
		e.stopPropagation();

		try {
			setIsLoading(true);
			await updateTask(task.id, { is_done: !task.is_done });
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		taskRef,
		taskRect,
		isLoading,
		activeView,
		setActiveView,
		handleEditClick,
		handleToggleComplete,
	};
};
