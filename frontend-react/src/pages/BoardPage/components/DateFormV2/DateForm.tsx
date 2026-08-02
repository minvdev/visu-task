import styles from "./DateForm.module.css";
import clsx from "clsx";

import {
	useState,
	type ComponentPropsWithRef,
} from "react";
import { useDateForm } from "./useDateForm";

import { TimeSelect } from "./components/TimeSelect/TimeSelect";
import { MonthNavigate } from "./components/MonthNavigate/MonthNavigate";
import { Day } from "./components/Day/Day";
import { Input } from "@atoms/InputV2/Input";
import { Button } from "@atoms/Button/Button";
import { MenuHeader } from "@molecules/MenuHeader/MenuHeader";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

import { components } from "@/types/open-api-schema";
export type TaskSubschema =
	components["schemas"]["CardSubschema"];

export interface DateFormProps extends ComponentPropsWithRef<"form"> {
	task: TaskSubschema;
	onClose: () => void;
}

export const DateForm = ({
	task,
	onClose,
	className,
	...props
}: DateFormProps) => {
	const {
		datePickerState,
		DaysOfTheWeek,
		handleMonthNavigate,
		handleDateSelect,
		handleTimeChange,
		handleDateInputBlur,
		handleSave,
		handleDelete,
	} = useDateForm(task);
	const { calendar, currentView, selectedDateTime } =
		datePickerState;

	const [date, setDate] = useState(
		datePickerState.selectedDateTime.date,
	);

	return (
		<form
			className={clsx(styles["container"], className)}
			{...props}
		>
			<MenuHeader
				title="Fecha"
				onClose={onClose}
				className={styles["header"]}
			/>

			<section className={styles["calendarContainer"]}>
				<div className={styles["calendarHeader"]}>
					<MonthNavigate
						onNavigate={() => handleMonthNavigate(-12)}
					>
						<ChevronsLeft />
					</MonthNavigate>

					<MonthNavigate
						onNavigate={() => handleMonthNavigate(-1)}
					>
						<ChevronLeft />
					</MonthNavigate>

					{`${currentView.month} ${currentView.year}`}

					<MonthNavigate
						onNavigate={() => handleMonthNavigate(1)}
					>
						<ChevronRight />
					</MonthNavigate>

					<MonthNavigate
						onNavigate={() => handleMonthNavigate(12)}
					>
						<ChevronsRight />
					</MonthNavigate>
				</div>

				<div className={styles["calendar"]}>
					<div className={styles["week"]}>
						{DaysOfTheWeek.map((day) => (
							<span key={day} className={styles["weekday"]}>
								{day}
							</span>
						))}
					</div>

					{calendar.map((week, i) => (
						<div className={styles["week"]} key={i}>
							{week.map((day) => (
								<Day
									onClick={() => {
										handleDateSelect(day.date);
										setDate(day.date);
									}}
									day={day}
									selectedDate={selectedDateTime.date}
									key={day.day}
								/>
							))}
						</div>
					))}
				</div>
			</section>

			<fieldset className={styles["fieldset"]}>
				<legend>Fecha de vencimiento</legend>
				<div className={styles["inputContainer"]}>
					<Input
						value={date}
						onChange={(e) => setDate(e.target.value)}
						onBlur={handleDateInputBlur}
						placeholder="D/M/AAAA"
						id="due-date"
						name="due-date"
						defaultStyles={false}
					/>
				</div>

				<TimeSelect
					inputValue={selectedDateTime.time}
					onInputChange={(e) =>
						handleTimeChange(e.target.value)
					}
					onSelect={(time) => handleTimeChange(time)}
					className={styles["inputContainer"]}
				/>
			</fieldset>

			<footer>
				<Button
					onClick={() => {
						handleSave();
						onClose();
					}}
					variants={["primary", "button-md"]}
					className={styles["formButton"]}
				>
					Guardar
				</Button>
				<Button
					onClick={() => {
						handleDelete();
						onClose();
					}}
					variants={["transparent", "button-md"]}
					className={styles["formButton"]}
				>
					Quitar
				</Button>
			</footer>
		</form>
	);
};
