import { useState, type FocusEvent } from "react";
import { getLocalizedWeekdays } from "@/utils/datetime";
import { useColumnActions } from "@hooks/useColumnActions";
import { TaskSubschema } from "./DateForm";

const LOCALE = navigator.language;
const TODAY = new Date();
const MONTH_ROWS = 6;
const DaysOfTheWeek = getLocalizedWeekdays(
	navigator.language,
	"short",
);

export type DatePickerState = {
	currentView: {
		month: string;
		year: string;
	};
	selectedDateTime: {
		date: string;
		time: string;
	};
	calendar: {
		day: number;
		date: string;
		isOtherMonth: boolean;
		isToday: boolean;
	}[][];
	date: Date;
};
type Week = DatePickerState["calendar"][number];

function getLocaleDate(date: Date) {
	return date.toLocaleDateString();
}
function getLocaleMonth(date: Date) {
	return date.toLocaleDateString(LOCALE, {
		month: "long",
	});
}
function getLocaleYear(date: Date) {
	return date.toLocaleDateString(LOCALE, {
		year: "numeric",
	});
}
function getLocaleTime(date: Date) {
	return date.toLocaleTimeString(LOCALE, {
		hour: "numeric",
		minute: "numeric",
	});
}

function calcDatePickerState(viewDate: Date) {
	const dayOfTheWeek = new Date(
		viewDate.getFullYear(),
		viewDate.getMonth(),
		1,
	).getDay();
	const mondayFirstDay = (dayOfTheWeek + 6) % 7;
	// Convert JavaScript's Sunday-first weekday index
	// to a Monday-first index.

	const calendarPointer = new Date(
		viewDate.getFullYear(),
		viewDate.getMonth(),
		1 - mondayFirstDay,
	);

	const datePicker: DatePickerState = {
		currentView: {
			month: getLocaleMonth(viewDate),
			year: getLocaleYear(viewDate),
		},
		selectedDateTime: {
			date: getLocaleDate(viewDate),
			time: getLocaleTime(viewDate),
		},
		calendar: [],
		date: viewDate,
	};

	for (let i = 0; i < MONTH_ROWS; i++) {
		const week: Week = [];
		for (const _ of DaysOfTheWeek) {
			const currentDay = calendarPointer.getDate();

			const calendarDate = {
				day: currentDay,
				date: getLocaleDate(calendarPointer),
				isOtherMonth:
					calendarPointer.getMonth() !==
					viewDate.getMonth(),
				isToday:
					calendarPointer.getFullYear() ===
						TODAY.getFullYear() &&
					calendarPointer.getMonth() === TODAY.getMonth() &&
					calendarPointer.getDate() === TODAY.getDate(),
			};

			week.push(calendarDate);
			calendarPointer.setDate(currentDay + 1);
		}
		datePicker.calendar.push(week);
	}
	return datePicker;
}

export const useDateForm = (task: TaskSubschema) => {
	const [datePickerState, setDatePickerState] = useState(
		calcDatePickerState(
			task.due_date
				? new Date(`${task.due_date}Z`)
				: new Date(),
		),
	);
	const { updateTask } = useColumnActions();

	function handleMonthNavigate(navigateValue: number) {
		setDatePickerState((prev) => {
			const navigatedDate = new Date(
				prev.date.getFullYear(),
				prev.date.getMonth() + navigateValue,
				prev.date.getDate(),
			);

			const newPickerState =
				calcDatePickerState(navigatedDate);

			return {
				...newPickerState,
				selectedDateTime: prev.selectedDateTime,
			};
		});
	}

	function handleDateSelect(date: string) {
		setDatePickerState((prev) => ({
			...prev,
			selectedDateTime: {
				...prev.selectedDateTime,
				date,
			},
		}));
	}

	function handleTimeChange(time: string) {
		setDatePickerState((prev) => ({
			...prev,
			selectedDateTime: { ...prev.selectedDateTime, time },
		}));
	}

	function handleDateInputBlur(
		e: FocusEvent<HTMLInputElement>,
	) {
		const raw = e.target.value;

		const parts = raw.split(/[\/\-\.]/);
		if (parts.length !== 3) {
			e.target.value =
				datePickerState.selectedDateTime.date;
			return;
		}

		const [a, b, c] = parts.map(Number);
		const date = new Date(c!, b! - 1, a);

		if (Number.isNaN(date.getTime())) {
			e.target.value =
				datePickerState.selectedDateTime.date;
			return;
		}

		const localeDate = getLocaleDate(date);

		e.target.value = localeDate;

		setDatePickerState((prev) => ({
			...prev,
			selectedDateTime: {
				...prev.selectedDateTime,
				date: localeDate,
			},
		}));
	}

	function handleSave() {
		const { date, time } = datePickerState.selectedDateTime;
		const [day, month, year] = date.split("/"); // D/M/AAAA
		const [hour, minute] = time.split(":"); // HH:MM

		try {
			const dateList = [year, month, day, hour, minute].map(
				(d) => {
					if (d === undefined) {
						throw new Error(
							"Parse error: Error saving the timestamp",
						);
					}
					return parseInt(d);
				},
			);

			const timestamp = new Date(
				dateList[0]!,
				dateList[1]! - 1,
				dateList[2]!,
				dateList[3]!,
				dateList[4]!,
			).toISOString();

			updateTask(task.id, {
				// due_date must recive a timestamp in ISO format
				due_date: timestamp,
			});
		} catch (error) {
			console.error(error);
			return;
		}
	}

	function handleDelete() {
		updateTask(task.id, {
			due_date: null,
		});
	}

	return {
		datePickerState,
		DaysOfTheWeek,
		handleMonthNavigate,
		handleDateSelect,
		handleTimeChange,
		handleDateInputBlur,
		handleSave,
		handleDelete,
	};
};
