import styles from "./DueDate.module.css";
import clsx from "clsx";

import { type ComponentPropsWithRef } from "react";
import { useDueDate } from "./useDueDate";

import { LucideClock } from "lucide-react";

export interface DueDateProps extends ComponentPropsWithRef<"div"> {
	due_date: string;
	is_done: boolean;
	variant?: "date" | "status";
}

export const DueDate = ({
	due_date,
	is_done,
	variant = "date",
	className,
}: DueDateProps) => {
	const { state, getDateString } = useDueDate(
		due_date,
		is_done,
	);

	const statusLabels: Record<string, string> = {
		completed: "Cumplida",
		expired: "Plazo vencido",
		upcoming: "Vence pronto",
		"in-time": "",
	};

	switch (variant) {
		case "date":
			return (
				<div
					className={clsx(
						styles["dateContainer"],
						styles[state],
						className,
					)}
				>
					<LucideClock size={16} />
					<span className={styles["date"]}>
						{getDateString("date")}
					</span>
				</div>
			);

		case "status":
			return (
				<div className={styles["statusContainer"]}>
					{getDateString("datetime")}
					{statusLabels[state] && (
						<span
							className={clsx(
								styles["statusLabel"],
								styles[state],
								className,
							)}
						>
							{statusLabels[state]}
						</span>
					)}
				</div>
			);
	}
};
