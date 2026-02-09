import styles from "./DateForm.module.css";
import clsx from "clsx";

import { useMemo, useState } from "react";

import { Header } from "../../molecules/Header/Header";
import { FormField } from "../../molecules/FormField/FormField";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";

export const DateForm = ({
	initialDateTime,
	onSave,
	onRemove,
	onClose,
	className,
}) => {
	const dateObject = new Date(`${initialDateTime}Z`);
	const initialDate = [
		String(dateObject.getFullYear()).padStart(4, "0"),
		String(dateObject.getMonth() + 1).padStart(2, "0"),
		String(dateObject.getDate()).padStart(2, "0"),
	].join("-");
	const initialTime = [
		String(dateObject.getHours()).padStart(2, "0"),
		String(dateObject.getMinutes()).padStart(2, "0"),
	].join(":");

	const [tempDate, setTempDate] = useState(
		initialDateTime && initialDate,
	);
	const [tempTime, setTempTime] = useState(
		initialDateTime && initialTime,
	);

	const dateStatus = useMemo(() => {
		if (!tempDate) return null;
		const selected = new Date(`${tempDate}T${tempTime}`);
		const now = new Date();
		const diff = selected - now;
		if (diff < 0)
			return {
				label: "Plazo vencido",
				style: styles.expired,
			};
		if (diff < 86400000)
			return {
				label: "Vence pronto",
				style: styles.upcoming,
			};
		return { label: "En plazo", style: styles.deadline };
	}, [tempDate, tempTime]);

	const handleShortcut = (days) => {
		const date = new Date();
		date.setDate(date.getDate() + days);
		const formattedDate = date.toISOString().split("T")[0];
		setTempDate(formattedDate);
	};

	const handleSave = () => {
		const localDate = new Date(`${tempDate}T${tempTime}`);
		onSave(localDate.toISOString());
	};

	return (
		<div className={clsx(styles.form, className)}>
			<Header level={4} onClose={onClose}>
				Fecha de vencimiento
			</Header>

			<section className={styles.inputSection}>
				<FormField
					label="Fecha"
					htmlFor="date"
					className={styles.formField}
				>
					<Input
						type="date"
						id="date"
						name="date"
						value={tempDate}
						onChange={(e) => setTempDate(e.target.value)}
						required
					/>
				</FormField>

				<FormField
					label="Hora"
					htmlFor="time"
					className={styles.formField}
				>
					<Input
						type="time"
						id="time"
						name="time"
						value={tempTime}
						onChange={(e) => setTempTime(e.target.value)}
						required
					/>
				</FormField>

				{dateStatus && (
					<div
						className={clsx(styles.badge, dateStatus.style)}
					>
						{dateStatus.label}
					</div>
				)}
			</section>

			<section className={styles.actionsSection}>
				<Button
					onClick={() => handleShortcut(1)}
					className={styles.actionBtn}
					variants={["button-md"]}
				>
					Mañana
				</Button>

				<Button
					onClick={() => handleShortcut(7)}
					className={styles.actionBtn}
					variants={["button-md"]}
				>
					En 1 semana
				</Button>
			</section>

			<footer>
				<Button
					onClick={handleSave}
					disabled={!tempDate || !tempTime}
					variants={["primary", "button-md"]}
				>
					{console.log(tempDate, tempTime)}
					Guardar
				</Button>

				<Button
					onClick={onRemove}
					className={styles.actionBtn}
					variants={["button-md"]}
				>
					Quitar fecha
				</Button>
			</footer>
		</div>
	);
};
