import {
	useState,
	type ChangeEvent,
	type SubmitEvent,
} from "react";
import type { EditTagFormProps } from "./EditTagForm";
import { useBoardActions } from "@hooks/useBoardActions";
import { VALIDATION_RULES } from "@constants/validationRules";

export const useEditTagForm = (
	initialTag: EditTagFormProps["tag"],
	onSuccess: EditTagFormProps["onSuccess"],
) => {
	const [tag, setTag] = useState(initialTag);
	const [isLoading, setIsLoading] = useState(false);
	const { updateTag, deleteTag } = useBoardActions();

	const handleNameChange = (
		e: ChangeEvent<HTMLInputElement>,
	) => {
		const { value } = e.target;
		if (value.length > VALIDATION_RULES.tag.name.maxLength)
			return;
		setTag({ ...tag, name: value });
	};

	const handleColorChange = (color: string) => {
		setTag({ ...tag, color });
	};

	const handleSubmit = async (
		e: SubmitEvent<HTMLFormElement>,
	) => {
		e.preventDefault();

		try {
			setIsLoading(true);
			await updateTag(tag.id, tag);
			await onSuccess?.();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			await deleteTag(tag.id);
			await onSuccess?.();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		tag,
		isLoading,
		handleNameChange,
		handleColorChange,
		handleSubmit,
		handleDelete,
	};
};
