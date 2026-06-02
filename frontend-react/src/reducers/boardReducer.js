export const boardReducer = (board, action) => {
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
						tags: c.tags.filter((t) => t.id != tagId),
					})),
				})),
			};
		}

		default:
			throw Error(`Unknown action: ${type}`);
	}
};
