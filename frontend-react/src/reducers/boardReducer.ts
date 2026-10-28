import type { components } from "@/types/open-api-schema";
type Board = components["schemas"]["Board"];

export type BoardState = Omit<Board, "lists"> & {
	lists: components["schemas"]["List"][];
};

export type BoardAction =
	| {
			type: "update-board";
			payload: {
				updatedBoard: components["schemas"]["Board"];
			};
	  }
	| {
			type: "move-task";
			payload: {
				task: components["schemas"]["CardSubschema"];
				sourceColumnId: components["schemas"]["List"]["id"];
				destinationColumnId: components["schemas"]["List"]["id"];
			};
	  }
	// Columns
	| {
			type: "create-column";
			payload: { newColumn: components["schemas"]["List"] };
	  }
	| {
			type: "update-column";
			payload: {
				columnId: components["schemas"]["List"]["id"];
				updatedColumn: components["schemas"]["List"];
			};
	  }
	| {
			type: "delete-column";
			payload: {
				columnId: components["schemas"]["List"]["id"];
			};
	  }
	// Tasks
	| {
			type: "create-task";
			payload: {
				columnId: components["schemas"]["List"]["id"];
				newTask: components["schemas"]["CardSubschema"];
			};
	  }
	| {
			type: "update-task";
			payload: {
				columnId: components["schemas"]["List"]["id"];
				taskId: components["schemas"]["CardSubschema"]["id"];
				updatedTask: components["schemas"]["CardSubschema"];
			};
	  }
	| {
			type: "delete-task";
			payload: {
				columnId: components["schemas"]["List"]["id"];
				taskId: components["schemas"]["CardSubschema"]["id"];
			};
	  }
	// Tags
	| {
			type: "create-tag";
			payload: {
				newTag: components["schemas"]["TagSubschema"];
			};
	  }
	| {
			type: "update-tag";
			payload: {
				tagId: components["schemas"]["TagSubschema"]["id"];
				updatedTag: components["schemas"]["TagSubschema"];
			};
	  }
	| {
			type: "delete-tag";
			payload: {
				tagId: components["schemas"]["TagSubschema"]["id"];
			};
	  };

export const boardReducer = (
	board: BoardState,
	action: BoardAction,
) => {
	const { type, payload } = action;

	switch (type) {
		// Board
		case "update-board": {
			const { updatedBoard } = payload;
			return {
				...updatedBoard,
				lists: board.lists,
			};
		}

		case "move-task": {
			const { task, sourceColumnId, destinationColumnId } =
				payload;

			return {
				...board,
				lists: board.lists.map((l) => {
					switch (l.id) {
						case sourceColumnId:
							return {
								...l,
								cards: l.cards.filter(
									(c) => c.id !== task.id,
								),
							};
						case destinationColumnId:
							return { ...l, cards: [...l.cards, task] };
						default:
							return l;
					}
				}),
			};
		}

		// Columns
		case "create-column": {
			const { newColumn } = payload;
			return {
				...board,
				lists: [...board.lists, newColumn],
			};
		}

		case "update-column": {
			const { columnId, updatedColumn } = payload;
			return {
				...board,
				lists: board.lists.map((l) =>
					l.id === columnId ? updatedColumn : l,
				),
			};
		}

		case "delete-column": {
			const { columnId } = payload;
			return {
				...board,
				lists: board.lists.filter((l) => l.id !== columnId),
			};
		}

		// Tasks
		case "create-task": {
			const { columnId, newTask } = payload;
			return {
				...board,
				lists: board.lists.map((l) =>
					l.id === columnId
						? { ...l, cards: [...l.cards, newTask] }
						: l,
				),
			};
		}

		case "update-task": {
			const { columnId, taskId, updatedTask } = payload;
			return {
				...board,
				lists: board.lists.map((l) =>
					l.id === columnId
						? {
								...l,
								cards: l.cards.map((c) =>
									c.id === taskId ? updatedTask : c,
								),
							}
						: l,
				),
			};
		}

		case "delete-task": {
			const { columnId, taskId } = payload;
			return {
				...board,
				lists: board.lists.map((l) =>
					l.id === columnId
						? {
								...l,
								cards: l.cards.filter(
									(c) => c.id !== taskId,
								),
							}
						: l,
				),
			};
		}

		// Tags
		case "create-tag": {
			const { newTag } = payload;
			return {
				...board,
				tags: [...board.tags, newTag],
			};
		}

		case "update-tag": {
			const { tagId, updatedTag } = payload;
			return {
				...board,
				tags: board.tags.map((t) =>
					t.id === tagId ? updatedTag : t,
				),
				lists: board.lists.map((l) => ({
					...l,
					cards: l.cards.map((c) => ({
						...c,
						tags: c.tags.map((t) =>
							t.id === tagId ? updatedTag : t,
						),
					})),
				})),
			};
		}

		case "delete-tag": {
			const { tagId } = payload;
			return {
				...board,
				tags: board.tags.filter((t) => t.id !== tagId),
				lists: board.lists.map((l) => ({
					...l,
					cards: l.cards.map((c) => ({
						...c,
						tags: c.tags.filter((t) => t.id !== tagId),
					})),
				})),
			};
		}

		default:
			throw Error(`Unknown action: ${type}`);
	}
};
