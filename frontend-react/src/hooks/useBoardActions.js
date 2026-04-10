import {
	useBoardState,
	useBoardDispatch,
} from "../hooks/useBoard";
import { boardService } from "../services/board";

export const useBoardActions = () => {
	const board = useBoardState();
	const dispatch = useBoardDispatch();

	// Hay que checkearlos
	// handleLoadModal
	// handleToggleTaskTag
	// fetchTask
	// tagLink

	// Board
	const handleBoardUpdate = async (body) => {
		try {
			const updatedBoard = await boardService.updateBoard(
				board.id,
				body,
			);
			dispatch({
				type: "update-board",
				payload: { updatedBoard },
			});
			return true;
		} catch (error) {
			console.log("Error saving board:", error);
			throw error;
		}
	};
	const handleBoardDelete = async () => {
		try {
			await boardService.deleteBoard(board.id);
			return true;
		} catch (error) {
			console.log("Error deleting board:", error);
			throw error;
		}
	};

	// Columns
	const handleColumnCreate = async (body) => {
		try {
			const newColumn = await boardService.createList(
				board.id,
				body,
			);
			dispatch({
				type: "create-column",
				payload: { newColumn },
			});
			return true;
		} catch (error) {
			console.log("Error adding column:", error);
			throw error;
		}
	};
	const handleColumnUpdate = async (columnId, body) => {
		try {
			const updatedColumn = await boardService.updateList(
				board.id,
				columnId,
				body,
			);
			dispatch({
				type: "update-column",
				payload: { columnId, updatedColumn },
			});
			return true;
		} catch (error) {
			console.log("Error saving column:", error);
			throw error;
		}
	};
	const handleColumnDelete = async (columnId) => {
		await boardService.deleteList(board.id, columnId);
		dispatch({
			type: "delete-column",
			payload: { columnId },
		});
		return true;
	};

	// Tasks
	const handleTaskCreate = async (columnId, body) => {
		try {
			const newTask = await boardService.createTask(
				board.id,
				columnId,
				body,
			);
			dispatch({
				type: "create-task",
				payload: { columnId, newTask },
			});
			return true;
		} catch (error) {
			console.log("Error adding task:", error);
			throw error;
		}
	};
	const handleTaskUpdate = async (
		columnId,
		taskId,
		body,
	) => {
		try {
			const updatedTask = await boardService.updateTask(
				board.id,
				columnId,
				taskId,
				body,
			);
			dispatch({
				type: "update-task",
				payload: { columnId, taskId, updatedTask },
			});
			return true;
		} catch (error) {
			console.log("Error saving task:", error);
			throw error;
		}
	};
	const handleTaskDelete = async (columnId, taskId) => {
		try {
			await boardService.deleteTask(
				board.id,
				columnId,
				taskId,
			);
			dispatch({
				type: "delete-task",
				payload: { columnId, taskId },
			});
			return true;
		} catch (error) {
			console.log("Error deleting task:", error);
			throw error;
		}
	};

	// Tags
	const handleTagCreate = async (body) => {
		try {
			const newTag = await boardService.createTag(
				board.id,
				body,
			);
			dispatch({ type: "create-tag", payload: { newTag } });
			return true;
		} catch (error) {
			console.log("Error adding tag:", error);
			throw error;
		}
	};
	const handleTagUpdate = async (tagId, body) => {
		try {
			const updatedTag = await boardService.updateTag(
				board.id,
				tagId,
				body,
			);
			dispatch({
				type: "update-tag",
				payload: { tagId, updatedTag },
			});
			return true;
		} catch (error) {
			console.log("Error saving tag:", error);
			throw error;
		}
	};
	const handleTagDelete = async (tagId) => {
		try {
			await boardService.deleteTag(board.id, tagId);
			dispatch({ type: "delete-tag", payload: { tagId } });
			return true;
		} catch (error) {
			console.log("Error deleting tag:", error);
			throw error;
		}
	};

	return {
		handleBoardUpdate,
		handleBoardDelete,
		handleColumnCreate,
		handleColumnUpdate,
		handleColumnDelete,
		handleTaskCreate,
		handleTaskUpdate,
		handleTaskDelete,
		handleTagCreate,
		handleTagUpdate,
		handleTagDelete,
	};
};
