import { client } from "./apiClient";
import { paths } from "@/types/open-api-schema";

/**
 * API Service Layer for the "Card" resource.
 * Here we centralize all URLs and HTTP methods.
 * No React component or hook should manually construct URLs.
 */

type MoveTaskPath =
	paths["/cards/{card_id}/move"]["post"]["parameters"]["path"];
type MoveTaskBody =
	paths["/cards/{card_id}/move"]["post"]["requestBody"]["content"]["application/json"];

type AttachTagPath =
	paths["/cards/{card_id}/tags/{tag_id}"]["post"]["parameters"]["path"];

type DetachTagPath =
	paths["/cards/{card_id}/tags/{tag_id}"]["delete"]["parameters"]["path"];

export const taskService = {
	moveTask: (path: MoveTaskPath, body: MoveTaskBody) =>
		client.POST("/cards/{card_id}/move", {
			params: { path },
			body,
		}),

	attachTag: (path: AttachTagPath) =>
		client.POST("/cards/{card_id}/tags/{tag_id}", {
			params: { path },
		}),

	detachTag: (path: DetachTagPath) =>
		client.DELETE("/cards/{card_id}/tags/{tag_id}", {
			params: { path },
		}),
};
