import { useState, type ChangeEvent } from "react";
import { useColumnActions } from "@hooks/useColumnActions";
import { TaskRenameModalProps } from "./TaskRenameModal";
import { VALIDATION_RULES } from "@constants/validationRules";

export const useTaskRenameModal = (
	task: TaskRenameModalProps["task"],
	onClose: TaskRenameModalProps["onClose"],
) => {
	const [name, setName] = useState(task.name);
	const [isLoading, setIsLoading] = useState(false);
	const { updateTask } = useColumnActions();

	const handleChange = (
		e: ChangeEvent<HTMLTextAreaElement>,
	) => {
		const { value } = e.target;
		if (value.length > VALIDATION_RULES.task.name.maxLength)
			return;
		setName(value);
	};

	const handleSubmit = async () => {
		const trimmedName = name.trim();
		if (!trimmedName) return;
		if (trimmedName !== task.name) {
			try {
				setIsLoading(true);
				await updateTask(task.id, { name: trimmedName });
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		}
		onClose();
	};

	return {
		name,
		isLoading,
		handleChange,
		handleSubmit,
	};
};
