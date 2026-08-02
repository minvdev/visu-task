import {
	RefObject,
	useLayoutEffect,
	useState,
} from "react";
import { useColumnActions } from "@hooks/useColumnActions";
import { VALIDATION_RULES } from "@constants/validationRules";

import { components } from "@/types/open-api-schema";
import { getDistanceToBorder } from "@/utils/getDistanceToBorder";
type TaskSubschema = components["schemas"]["CardSubschema"];

export const useTaskDetailsModal = (
	task: TaskSubschema,
	modalRef: RefObject<Element | null>,
) => {
	const { updateTask } = useColumnActions();
	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState(task.name);
	const [description, setDescription] = useState(task.text);
	const [elementMaxHeight, setElementMaxHeight] =
		useState(0);

	const handleCheck = async () => {
		try {
			setIsLoading(true);
			await updateTask(task.id, { is_done: !task.is_done });
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleNameChange = (value: string) => {
		if (value.length > VALIDATION_RULES.task.name.maxLength)
			return;
		setName(value);
	};

	const saveName = async () => {
		const trimmedValue = name.trim();
		if (!trimmedValue) return;
		if (trimmedValue !== task.name) {
			try {
				setIsLoading(true);
				await updateTask(task.id, { name: trimmedValue });
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleDescriptionChange = (value: string) => {
		if (value.length > VALIDATION_RULES.task.text.maxLength)
			return;
		setDescription(value);
	};

	const saveDescription = async () => {
		const trimmedValue = description?.trim();
		if (trimmedValue !== task.text) {
			try {
				setIsLoading(true);
				await updateTask(task.id, {
					text: trimmedValue ?? null,
				});
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	useLayoutEffect(() => {
		if (!modalRef.current) {
			return;
		}
		const modalHeight =
			modalRef.current.getBoundingClientRect().height;
		const distanceToBottom = getDistanceToBorder(modalRef);

		setElementMaxHeight(modalHeight + distanceToBottom);
	}, [modalRef]);

	return {
		isLoading,
		name,
		description,
		elementMaxHeight,
		handleCheck,
		handleNameChange,
		saveName,
		handleDescriptionChange,
		saveDescription,
	};
};
