export const VALIDATION_RULES = {
	board: {
		name: {
			minLength: 1,
			maxLength: 100,
		},
		description: {
			maxLength: 255,
		},
		imageUrl: {
			maxLength: 255,
		},
	},
	column: {
		name: {
			minLength: 1,
			maxLength: 100,
		},
	},
	tag: {
		name: {
			minLength: 0,
			maxLength: 50,
		},
		color: {
			minLength: 4,
			maxLength: 7,
			pattern: "^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$",
		},
	},
	task: {
		name: {
			minLength: 1,
			maxLength: 100,
		},
		text: {
			maxLength: 255,
		},
		destinationListId: {
			minimum: 1,
		},
		destinationListPosition: {
			minimum: 1,
		},
	},
	user: {
		username: {
			minLength: 3,
			maxLength: 64,
		},
		email: {
			format: "email",
		},
		password: {
			minLength: 8,
			maxLength: 256,
		},
	},
};
