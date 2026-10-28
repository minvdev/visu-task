import {
	useState,
	type ChangeEvent,
	type SubmitEvent,
} from "react";
import type { CreateTagFormProps } from "./CreateTagForm";
import { useBoardActions } from "@hooks/useBoardActions";
import type { TagProps } from "@pages/BoardPage/components/Tag/Tag";
import { tagColors } from "@constants/tagColors";
import { VALIDATION_RULES } from "@constants/validationRules";

type Tag = TagProps["tag"];
const defaultColor = tagColors[0];

export const useCreateTagForm = (
	onSuccess: CreateTagFormProps["onSuccess"],
) => {
	const [tag, setTag] = useState<Tag>({
		color: defaultColor.backgroundColor,
		id: defaultColor.id,
		name: null,
	});
	const [isLoading, setIsLoading] = useState(false);
	const { createTag } = useBoardActions();

	const handleNameChange = (
		e: ChangeEvent<HTMLInputElement>,
	) => {
		const { value } = e.target;
		if (
			value.length > VALIDATION_RULES.tag.name.maxLength
		) {
			return;
		}
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
			const { id } = await createTag({
				...tag,
				name: tag.name?.trim() ?? null,
			});
			await onSuccess?.(id);
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
	};
};
