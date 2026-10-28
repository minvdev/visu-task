import styles from "./Day.module.css";
import clsx from "clsx";

import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import type { DatePickerState } from "../../useDateForm";

export interface DayProps {
	onClick: () => void;
	day: DatePickerState["calendar"][number][number];
	selectedDate: string;
}

export function Day({
	onClick,
	day: day,
	selectedDate,
}: DayProps) {
	return (
		<ButtonBase
			className={clsx(
				styles["day"],
				day.isToday && styles["today"],
				day.isOtherMonth && styles["otherMonth"],
				day.date === selectedDate && styles["selected"],
			)}
			onClick={onClick}
		>
			{day.day}
		</ButtonBase>
	);
}
