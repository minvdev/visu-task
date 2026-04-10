import { apiFetch } from "./apiClient";

/**
 * API Service Layer for the "Card" resource.
 * Here we centralize all URLs and HTTP methods.
 * No React component or hook should manually construct URLs.
 */
export const taskService = {
	moveTask(taskId, columnId, position = null) {
		return apiFetch(`/cards/${taskId}/move`, {
			method: "POST",
			body: {
				destination_list_id: columnId,
				destination_list_position: position,
			},
		});
	},

	attachTag(taskId, tagId) {
		return apiFetch(`/cards/${taskId}/tags/${tagId}`, {
			method: "POST",
		});
	},

	detachTag(taskId, tagId) {
		return apiFetch(`/cards/${taskId}/tags/${tagId}`, {
			method: "DELETE",
		});
	},
};
