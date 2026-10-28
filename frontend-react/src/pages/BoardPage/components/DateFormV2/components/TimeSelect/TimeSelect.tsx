import styles from "./TimeSelect.module.css";
import clsx from "clsx";

import { ChangeEvent, useRef, useState } from "react";
import { getDistanceToBorder } from "@/utils/getDistanceToBorder";
import { useClickOutside } from "@hooks/useClickOutside";

import { Input } from "@atoms/InputV2/Input";
import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import { LucideChevronDown } from "lucide-react";

const HOURS: string[] = [];
const nineStartsTime = new Date("2026-01-01T09:00:00");
for (let i = 0; i < 24; i++) {
	const hour = nineStartsTime.getHours();
	HOURS.push(`${hour}:00`);
	HOURS.push(`${hour}:${30}`);
	nineStartsTime.setHours(hour + 1);
}

export interface TimeSelectProps {
	inputValue: string;
	onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onSelect: (time: string) => void;
	className?: string | undefined;
}

export const TimeSelect = ({
	inputValue: value,
	onInputChange: onChange,
	onSelect: onSelect,
	className,
}: TimeSelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const dropdownHeight = getDistanceToBorder(
		inputRef,
		"bottom",
	);

	useClickOutside([inputRef, dropdownRef], () =>
		setIsOpen(false),
	);

	return (
		<div
			className={clsx(styles["container"], className)}
			ref={containerRef}
		>
			<Input
				value={value}
				onChange={onChange}
				onFocus={() => setIsOpen(true)}
				ref={inputRef}
				defaultStyles={false}
				className={styles["input"]}
				id="due-time"
				name="due-time"
				placeholder="HH:MM"
			/>
			<ButtonBase onClick={() => setIsOpen(true)}>
				<LucideChevronDown />
			</ButtonBase>

			{isOpen && (
				<div
					ref={dropdownRef}
					className={styles["dropdow"]}
					style={{
						height: Math.min(dropdownHeight, 200),
					}}
				>
					<ul className={styles["list"]}>
						{HOURS.map((time) => (
							<li key={time}>
								<ButtonBase
									onClick={() => {
										onSelect(time);
										setIsOpen(false);
									}}
									className={clsx(
										styles["option"],
										value === time && styles["selected"],
									)}
								>
									{time}
								</ButtonBase>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
