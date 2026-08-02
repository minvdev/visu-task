const ONE_DAY_MS = 24 * 60 * 60 * 1000;
function getState(dateString: string, isDone: boolean) {
	if (isDone) return "completed";

	const now = new Date();
	const diffMs =
		new Date(dateString).getTime() - now.getTime();

	if (diffMs < 0) return "expired";
	if (diffMs < ONE_DAY_MS) return "upcoming";
	return "in-time";
}

function getFormattedDate(
	dueDate: string,
	formatOptions: Intl.DateTimeFormatOptions,
) {
	const date = new Date(`${dueDate}Z`);
	const actualYear = new Date().getFullYear();
	if (date.getFullYear() !== actualYear) {
		formatOptions.year = "numeric";
	}

	const formattedDateTime = new Intl.DateTimeFormat(
		navigator.language,
		formatOptions,
	).format(date);

	return formattedDateTime;
}

export const useDueDate = (
	due_date: string,
	is_done: boolean,
) => {
	const state = getState(due_date, is_done);

	const getDateString = (dateTipe: "date" | "datetime") => {
		let dateOptions: Intl.DateTimeFormatOptions = {
			day: "numeric",
			month: "short",
		};
		if (dateTipe === "datetime") {
			dateOptions = {
				...dateOptions,
				hour: "numeric",
				minute: "numeric",
			};
		}
		return getFormattedDate(due_date, dateOptions);
	};

	return {
		state,
		getDateString,
	};
};
