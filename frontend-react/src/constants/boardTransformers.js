export const boardTransformers = {
	setupBoard: (board, lists) => ({ ...board, lists }),

	updateBoard: (board, updatedBoard) => ({
		...updatedBoard,
		lists: board.lists,
	}),

	addColumn: (board, newColumn) => ({
		...board,
		lists: [...board.lists, newColumn],
	}),

	deleteColumn: (board, columnId) => ({
		...board,
		lists: board.lists.filter((l) => l.id !== columnId),
	}),

	updateColumn: (board, columnId, updatedColumn) => ({
		...board,
		lists: board.lists.map((l) =>
			l.id === columnId ? updatedColumn : l,
		),
	}),

	addTask: (board, columnId, newTask) => ({
		...board,
		lists: board.lists.map((l) =>
			l.id === columnId
				? { ...l, cards: [...l.cards, newTask] }
				: l,
		),
	}),

	deleteTask: (board, columnId, taskId) => ({
		...board,
		lists: board.lists.map((l) =>
			l.id === columnId
				? {
						...l,
						cards: l.cards.filter((c) => c.id !== taskId),
					}
				: l,
		),
	}),

	updateTask: (board, columnId, taskId, updatedTask) => ({
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
	}),
};
