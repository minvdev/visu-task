import { useBoardDispatch } from "@hooks/useBoard";
import { taskService } from "@services/task";
import { toCardSubschema } from "@/utils/boardTransformers";

export const useTaskActions = () => {
	const dispatch = useBoardDispatch();

	// Movement
	const moveTask: {
		(
			taskId: Parameters<
				typeof taskService.moveTask
			>["0"]["card_id"],
			sourceColumnId: Parameters<
				typeof taskService.moveTask
			>["1"]["destination_list_id"],
			destinationColumnId: Parameters<
				typeof taskService.moveTask
			>["1"]["destination_list_id"],
		): Promise<void>;
	} = async (
		taskId,
		sourceColumnId,
		destinationColumnId,
	) => {
		const { data, error } = await taskService.moveTask(
			{ card_id: taskId },
			{ destination_list_id: destinationColumnId },
		);

		if (error || !data)
			throw error ?? new Error("Error moving task");

		dispatch({
			type: "move-task",
			payload: {
				task: toCardSubschema(data),
				sourceColumnId,
				destinationColumnId,
			},
		});
	};

	// Tags
	const attachTag: {
		(
			taskId: Parameters<
				typeof taskService.attachTag
			>[0]["card_id"],
			tagId: Parameters<
				typeof taskService.attachTag
			>[0]["tag_id"],
		): Promise<void>;
	} = async (taskId, tagId) => {
		const { data, error } = await taskService.attachTag({
			card_id: taskId,
			tag_id: tagId,
		});

		if (error || !data)
			throw error ?? new Error("Error attaching tag");

		dispatch({
			type: "update-task",
			payload: {
				columnId: data.list_id,
				taskId,
				updatedTask: toCardSubschema(data),
			},
		});
	};

	const detachTag: {
		(
			taskId: Parameters<
				typeof taskService.detachTag
			>[0]["card_id"],
			tagId: Parameters<
				typeof taskService.detachTag
			>[0]["tag_id"],
		): Promise<void>;
	} = async (taskId, tagId) => {
		const { data, error } = await taskService.detachTag({
			card_id: taskId,
			tag_id: tagId,
		});

		if (error || !data)
			throw error ?? new Error("Error detaching tag");

		dispatch({
			type: "update-task",
			payload: {
				columnId: data.list_id,
				taskId,
				updatedTask: toCardSubschema(data),
			},
		});
	};

	return { moveTask, attachTag, detachTag };
};
