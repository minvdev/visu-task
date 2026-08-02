import { useState, useRef, type SubmitEvent } from "react";
import { useClickOutside } from "@hooks/useClickOutside";
import { useColumnActions } from "@hooks/useColumnActions";
import type { CreateTaskFormProps } from "./CreateTaskForm";

export const useCreateTaskForm = (
	onClose: CreateTaskFormProps["onClose"],
) => {
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const formRef = useRef<HTMLFormElement | null>(null);
	useClickOutside(formRef, () => onClose());
	const { createTask } = useColumnActions();

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		const trimmedName = name.trim();
		if (!trimmedName) return;
		setName("");
		try {
			setIsLoading(true);
			await createTask({ name: trimmedName });
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		isLoading,
		formRef,
		name,
		setName,
		handleSubmit,
	};
};
