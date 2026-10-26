import {
	useBoardState,
	useBoardDispatch,
} from "./useBoard";
import { boardService } from "@services/board";
import {
	toCardSubschema,
	toTagSubschema,
} from "@/utils/boardTransformers";

export const useBoardActions = () => {
	const board = useBoardState();
	const dispatch = useBoardDispatch();

	// Board
	const updateBoard = async (
		body: Parameters<typeof boardService.updateBoard>[1],
	) => {
		const { data, error } = await boardService.updateBoard(
			{ board_id: board.id },
			body,
		);

		if (error || !data)
			throw error ?? new Error("Error saving board");

		dispatch({
			type: "update-board",
			payload: { updatedBoard: data },
		});
	};
	const deleteBoard = async () => {
		const { error } = await boardService.deleteBoard({
			board_id: board.id,
		});

		if (error) throw error;
	};

	// Columns
	const createColumn = async (
		body: Parameters<typeof boardService.createList>[1],
	) => {
		const { data, error } = await boardService.createList(
			{ board_id: board.id },
			body,
		);

		if (error || !data)
			throw error ?? new Error("Error creating list");

		dispatch({
			type: "create-column",
			payload: { newColumn: data },
		});
	};
	const _updateColumn = async (
		columnId: Parameters<
			typeof boardService.updateList
		>[0]["list_id"],
		body: Parameters<typeof boardService.updateList>[1],
	) => {
		const { data, error } = await boardService.updateList(
			{ board_id: board.id, list_id: columnId },
			body,
		);

		if (error || !data)
			throw error ?? new Error("Error saving column");

		dispatch({
			type: "update-column",
			payload: { columnId, updatedColumn: data },
		});
	};
	const _deleteColumn = async (
		columnId: Parameters<
			typeof boardService.deleteList
		>[0]["list_id"],
	) => {
		const { error } = await boardService.deleteList({
			board_id: board.id,
			list_id: columnId,
		});

		if (error) throw error;

		dispatch({
			type: "delete-column",
			payload: { columnId },
		});
	};

	// Tasks
	const _createTask = async (
		columnId: Parameters<
			typeof boardService.createTask
		>[0]["list_id"],
		body: Parameters<typeof boardService.createTask>[1],
	) => {
		const { data, error } = await boardService.createTask(
			{ board_id: board.id, list_id: columnId },
			body,
		);

		if (error || !data)
			throw error ?? new Error("Error adding task");

		dispatch({
			type: "create-task",
			payload: { columnId, newTask: toCardSubschema(data) },
		});
	};
	const _updateTask = async (
		columnId: Parameters<
			typeof boardService.updateTask
		>[0]["list_id"],
		taskId: Parameters<
			typeof boardService.updateTask
		>[0]["card_id"],
		body: Parameters<typeof boardService.updateTask>[1],
	) => {
		const { data, error } = await boardService.updateTask(
			{
				board_id: board.id,
				list_id: columnId,
				card_id: taskId,
			},
			body,
		);

		if (error || !data)
			throw error ?? new Error("Error saving task");

		dispatch({
			type: "update-task",
			payload: {
				columnId,
				taskId,
				updatedTask: toCardSubschema(data),
			},
		});
	};
	const _deleteTask = async (
		columnId: Parameters<
			typeof boardService.deleteTask
		>[0]["list_id"],
		taskId: Parameters<
			typeof boardService.deleteTask
		>[0]["card_id"],
	) => {
		const { error } = await boardService.deleteTask({
			board_id: board.id,
			list_id: columnId,
			card_id: taskId,
		});

		if (error) throw error;

		dispatch({
			type: "delete-task",
			payload: { columnId, taskId },
		});
	};

	// Tags
	const createTag = async (
		body: Parameters<typeof boardService.createTag>[1],
	) => {
		const { data, error } = await boardService.createTag(
			{ board_id: board.id },
			body,
		);

		if (error || !data)
			throw error ?? new Error("Error adding tag");

		const newTag = toTagSubschema(data);

		dispatch({
			type: "create-tag",
			payload: { newTag },
		});

		return newTag;
	};
	const updateTag = async (
		tagId: Parameters<
			typeof boardService.updateTag
		>[0]["tag_id"],
		body: Parameters<typeof boardService.updateTag>[1],
	) => {
		const { data, error } = await boardService.updateTag(
			{ board_id: board.id, tag_id: tagId },
			body,
		);

		if (error || !data)
			throw error ?? new Error("Error saving tag");

		dispatch({
			type: "update-tag",
			payload: {
				tagId,
				updatedTag: toTagSubschema(data),
			},
		});
	};
	const deleteTag = async (
		tagId: Parameters<
			typeof boardService.deleteTag
		>[0]["tag_id"],
	) => {
		const { error } = await boardService.deleteTag({
			board_id: board.id,
			tag_id: tagId,
		});

		if (error) throw error;

		dispatch({ type: "delete-tag", payload: { tagId } });
	};

	return {
		updateBoard,
		deleteBoard,
		createColumn,
		_updateColumn,
		_deleteColumn,
		_createTask,
		_updateTask,
		_deleteTask,
		createTag,
		updateTag,
		deleteTag,
	};
};
