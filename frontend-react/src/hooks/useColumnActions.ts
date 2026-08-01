import { useColumn } from "@hooks/useColumn";
import { useBoardActions } from "@hooks/useBoardActions";

export const useColumnActions = () => {
	const column = useColumn();
	const {
		_updateColumn,
		_deleteColumn,
		_createTask,
		_deleteTask,
		_updateTask,
	} = useBoardActions();

	const updateColumn = (
		body: Parameters<typeof _updateColumn>["1"],
	) => _updateColumn(column.id, body);

	const deleteColumn = () => _deleteColumn(column.id);

	const createTask = (
		body: Parameters<typeof _createTask>["1"],
	) => _createTask(column.id, body);

	const deleteTask = (
		taskId: Parameters<typeof _deleteTask>["1"],
	) => _deleteTask(column.id, taskId);

	const updateTask = (
		taskId: Parameters<typeof _updateTask>["1"],
		body: Parameters<typeof _updateTask>["2"],
	) => _updateTask(column.id, taskId, body);

	return {
		updateColumn,
		deleteColumn,
		createTask,
		deleteTask,
		updateTask,
	};
};
