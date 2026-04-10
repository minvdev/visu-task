import { apiFetch } from "./apiClient";

/**
 * API Service Layer for the "Board" resource.
 * Here we centralize all URLs and HTTP methods.
 * No React component or hook should manually construct URLs.
 */
export const boardService = {
	// --- Boards ---
	getBoards: () => apiFetch("/boards"),

	getBoard: (boardId) => apiFetch(`/boards/${boardId}`),

	createBoard: (body) =>
		apiFetch("/boards", { method: "POST", body }),

	updateBoard: (boardId, body) =>
		apiFetch(`/boards/${boardId}`, {
			method: "PATCH",
			body,
		}),

	deleteBoard: (boardId) =>
		apiFetch(`/boards/${boardId}`, { method: "DELETE" }),

	// --- Lists (Columns) ---
	getLists: (boardId) =>
		apiFetch(`/boards/${boardId}/lists`),

	getList: (boardId, listId) =>
		apiFetch(`/boards/${boardId}/lists/${listId}`),

	createList: (boardId, body) =>
		apiFetch(`/boards/${boardId}/lists`, {
			method: "POST",
			body,
		}),

	updateList: (boardId, listId, body) =>
		apiFetch(`/boards/${boardId}/lists/${listId}`, {
			method: "PATCH",
			body,
		}),

	deleteList: (boardId, listId) =>
		apiFetch(`/boards/${boardId}/lists/${listId}`, {
			method: "DELETE",
		}),

	// --- Cards (Tasks) ---
	getTasks: (boardId, listId) =>
		apiFetch(`/boards/${boardId}/lists/${listId}/cards`),

	getTask: (boardId, listId, taskId) =>
		apiFetch(
			`/boards/${boardId}/lists/${listId}/cards/${taskId}`,
		),

	createTask: (boardId, listId, body) =>
		apiFetch(`/boards/${boardId}/lists/${listId}/cards`, {
			method: "POST",
			body,
		}),

	updateTask: (boardId, listId, cardId, body) =>
		apiFetch(
			`/boards/${boardId}/lists/${listId}/cards/${cardId}`,
			{ method: "PATCH", body },
		),

	deleteTask: (boardId, listId, cardId) =>
		apiFetch(
			`/boards/${boardId}/lists/${listId}/cards/${cardId}`,
			{ method: "DELETE" },
		),

	// --- Tags ---
	getTags: (boardId) => apiFetch(`/boards/${boardId}/tags`),

	getTag: (boardId, tagId) =>
		apiFetch(`/boards/${boardId}/tags/${tagId}`),

	createTag: (boardId, body) =>
		apiFetch(`/boards/${boardId}/tags`, {
			method: "POST",
			body,
		}),

	updateTag: (boardId, tagId, body) =>
		apiFetch(`/boards/${boardId}/tags/${tagId}`, {
			method: "PATCH",
			body,
		}),

	deleteTag: (boardId, tagId) =>
		apiFetch(`/boards/${boardId}/tags/${tagId}`, {
			method: "DELETE",
		}),
};
