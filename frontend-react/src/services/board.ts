import { client } from "./apiClient";
import type { paths } from "@/types/open-api-schema";

/**
 * API Service Layer for the "Board" resource.
 * Here we centralize all URLs and HTTP methods.
 * No React component or hook should manually construct URLs.
 */

// Board
type GetBoardPath =
	paths["/boards/{board_id}"]["get"]["parameters"]["path"];

type CreateBoardBody =
	paths["/boards"]["post"]["requestBody"]["content"]["application/json"];

type UpdateBoardPath =
	paths["/boards/{board_id}"]["patch"]["parameters"]["path"];
type UpdateBoardBody =
	paths["/boards/{board_id}"]["patch"]["requestBody"]["content"]["application/json"];

type DeleteBoardPath =
	paths["/boards/{board_id}"]["delete"]["parameters"]["path"];

// List
type GetListsPath =
	paths["/boards/{board_id}/lists"]["get"]["parameters"]["path"];
type GetListPath =
	paths["/boards/{board_id}/lists/{list_id}"]["get"]["parameters"]["path"];

type CreateListPath =
	paths["/boards/{board_id}/lists"]["post"]["parameters"]["path"];
type CreateListBody =
	paths["/boards/{board_id}/lists"]["post"]["requestBody"]["content"]["application/json"];

type UpdateListPath =
	paths["/boards/{board_id}/lists/{list_id}"]["patch"]["parameters"]["path"];
type UpdateListBody =
	paths["/boards/{board_id}/lists/{list_id}"]["patch"]["requestBody"]["content"]["application/json"];

type DeleteListPath =
	paths["/boards/{board_id}/lists/{list_id}"]["delete"]["parameters"]["path"];

// Task
type GetTasksPath =
	paths["/boards/{board_id}/lists/{list_id}/cards"]["get"]["parameters"]["path"];
type GetTaskPath =
	paths["/boards/{board_id}/lists/{list_id}/cards/{card_id}"]["get"]["parameters"]["path"];

type CreateTaskPath =
	paths["/boards/{board_id}/lists/{list_id}/cards"]["post"]["parameters"]["path"];
type CreateTaskBody =
	paths["/boards/{board_id}/lists/{list_id}/cards"]["post"]["requestBody"]["content"]["application/json"];

type UpdateTaskPath =
	paths["/boards/{board_id}/lists/{list_id}/cards/{card_id}"]["patch"]["parameters"]["path"];
type UpdateTaskBody =
	paths["/boards/{board_id}/lists/{list_id}/cards/{card_id}"]["patch"]["requestBody"]["content"]["application/json"];

type DeleteTaskPath =
	paths["/boards/{board_id}/lists/{list_id}/cards/{card_id}"]["delete"]["parameters"]["path"];

// Tag
type GetTagsPath =
	paths["/boards/{board_id}/tags"]["get"]["parameters"]["path"];
type GetTagPath =
	paths["/boards/{board_id}/tags/{tag_id}"]["get"]["parameters"]["path"];

type CreateTagPath =
	paths["/boards/{board_id}/tags"]["post"]["parameters"]["path"];
type CreateTagBody =
	paths["/boards/{board_id}/tags"]["post"]["requestBody"]["content"]["application/json"];

type UpdateTagPath =
	paths["/boards/{board_id}/tags/{tag_id}"]["patch"]["parameters"]["path"];
type UpdateTagBody =
	paths["/boards/{board_id}/tags/{tag_id}"]["patch"]["requestBody"]["content"]["application/json"];

type DeleteTagPath =
	paths["/boards/{board_id}/tags/{tag_id}"]["delete"]["parameters"]["path"];

export const boardService = {
	// --- Boards ---
	getBoards: () => client.GET("/boards"),

	getBoard: (path: GetBoardPath) =>
		client.GET("/boards/{board_id}", {
			params: { path },
		}),

	createBoard: (body: CreateBoardBody) =>
		client.POST("/boards", { body }),

	updateBoard: (
		path: UpdateBoardPath,
		body: UpdateBoardBody,
	) =>
		client.PATCH("/boards/{board_id}", {
			params: { path },
			body,
		}),

	deleteBoard: (path: DeleteBoardPath) =>
		client.DELETE("/boards/{board_id}", {
			params: { path },
		}),

	// --- Lists (Columns) ---
	getLists: (path: GetListsPath) =>
		client.GET("/boards/{board_id}/lists", {
			params: { path },
		}),

	getList: (path: GetListPath) =>
		client.GET("/boards/{board_id}/lists/{list_id}", {
			params: { path },
		}),

	createList: (
		path: CreateListPath,
		body: CreateListBody,
	) =>
		client.POST("/boards/{board_id}/lists", {
			params: { path },
			body,
		}),

	updateList: (
		path: UpdateListPath,
		body: UpdateListBody,
	) =>
		client.PATCH("/boards/{board_id}/lists/{list_id}", {
			params: { path },
			body,
		}),

	deleteList: (path: DeleteListPath) =>
		client.DELETE("/boards/{board_id}/lists/{list_id}", {
			params: { path },
		}),

	// --- Cards (Tasks) ---
	getTasks: (path: GetTasksPath) =>
		client.GET("/boards/{board_id}/lists/{list_id}/cards", {
			params: { path },
		}),

	getTask: (path: GetTaskPath) =>
		client.GET(
			"/boards/{board_id}/lists/{list_id}/cards/{card_id}",
			{ params: { path } },
		),

	createTask: (
		path: CreateTaskPath,
		body: CreateTaskBody,
	) =>
		client.POST(
			"/boards/{board_id}/lists/{list_id}/cards",
			{ params: { path }, body },
		),

	updateTask: (
		path: UpdateTaskPath,
		body: UpdateTaskBody,
	) =>
		client.PATCH(
			"/boards/{board_id}/lists/{list_id}/cards/{card_id}",
			{ params: { path }, body },
		),

	deleteTask: (path: DeleteTaskPath) =>
		client.DELETE(
			"/boards/{board_id}/lists/{list_id}/cards/{card_id}",
			{ params: { path } },
		),

	// --- Tags ---
	getTags: (path: GetTagsPath) =>
		client.GET("/boards/{board_id}/tags", {
			params: { path },
		}),

	getTag: (path: GetTagPath) =>
		client.GET("/boards/{board_id}/tags/{tag_id}", {
			params: { path },
		}),

	createTag: (path: CreateTagPath, body: CreateTagBody) =>
		client.POST("/boards/{board_id}/tags", {
			body,
			params: { path },
		}),

	updateTag: (path: UpdateTagPath, body: UpdateTagBody) =>
		client.PATCH("/boards/{board_id}/tags/{tag_id}", {
			body,
			params: { path },
		}),

	deleteTag: (path: DeleteTagPath) =>
		client.DELETE("/boards/{board_id}/tags/{tag_id}", {
			params: { path },
		}),
};
