import styles from "./EditableText.module.css";
import clsx from "clsx";

import { useState, useRef, useEffect } from "react";

import { Input } from "../../atoms/Input/Input";
import { TextArea } from "../../atoms/TextArea/TextArea";

export const EditableText = ({
	children,
	className,
	component = "div",
	componentProps = {},
	displayClass,
	onSave,
	inputName = "",
	multiline = false,
	maxInputLength = 0,
	placeholder = "",
	isEditing: controlledEditing = null,
	onRequestEdit,
	onEditingChange,
}) => {
	const Component = component;
	const InputComponent = multiline ? TextArea : Input;

	const [tempValue, setTempValue] = useState(
		children || "",
	);
	const [internalEditing, setInternalEditing] =
		useState(false);

	const isEditing = controlledEditing ?? internalEditing;

	const inputRef = useRef(null);

	const handleClick = () => {
		onRequestEdit && onRequestEdit();

		if (controlledEditing === null)
			setInternalEditing(true);
	};

	const handleChange = (e) => {
		const newValue = e.target.value;
		if (
			maxInputLength > 0 &&
			newValue.length > maxInputLength
		) {
			return;
		}
		setTempValue(newValue);
	};

	const handleKeyDown = (e) => {
		if (["Enter", "Escape"].includes(e.key))
			e.currentTarget.blur();
	};

	const handleBlur = () => {
		const formattedInput = tempValue.trim();
		setTempValue(formattedInput);
		if (formattedInput !== children) {
			onSave(formattedInput);
		}

		if (controlledEditing !== null) {
			onEditingChange && onEditingChange(false);
		} else setInternalEditing(false);
	};

	useEffect(() => {
		const setInitialValues = async () => {
			setTempValue(children || "");
		};
		setInitialValues();
	}, [children]);

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.select();
		}
	}, [isEditing]);

	return (
		<div className={styles.wrapper}>
			<Component
				{...componentProps}
				className={clsx(
					className,
					displayClass,
					styles.grid,
					styles.display,
					isEditing ? styles.inactive : styles.active,
				)}
				onClick={handleClick}
				checked={isEditing}
			>
				{tempValue || placeholder}
			</Component>

			<Component
				{...componentProps}
				className={clsx(
					className,
					styles.mockComponent,
					styles.grid,
				)}
				checked={isEditing}
			>
				<InputComponent
					className={clsx(
						className,
						styles.common,
						styles.input,
						isEditing ? styles.active : styles.inactive,
					)}
					id={inputName}
					value={tempValue}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onBlur={handleBlur}
					ref={inputRef}
					checked={isEditing}
					onClick={(e) => e.stopPropagation()}
				/>
			</Component>
		</div>
	);
};
