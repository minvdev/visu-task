import styles from "./EditableText.module.css";
import clsx from "clsx";

import {
	useState,
	useRef,
	useEffect,
	isValidElement,
	cloneElement,
} from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useKeyPress } from "../../../hooks/useKeyPress";

import { Input } from "../../atoms/Input/Input";
import { TextArea } from "../../atoms/TextArea/TextArea";

export const EditableText = ({
	children,
	className,
	onSave,
	inputName = "",
	multiline = false,
	maxInputLength = 0,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [tempValue, setTempValue] = useState(null);
	const [prevValue, setPrevValue] = useState(null);
	const [savedValue, setSavedValue] = useState(null);
	const [inheritedStyles, setInheritedStyles] = useState(
		new Object(),
	);
	const inputRef = useRef(null);

	const closeEditor = async () => {
		const newValue = tempValue.trim();
		if (newValue && newValue !== prevValue) {
			await onSave(newValue);
			setSavedValue(newValue);
		}
		setIsEditing(false);
	};

	useClickOutside(inputRef, closeEditor);
	useKeyPress("Escape", isEditing, closeEditor);
	useKeyPress("Enter", isEditing, closeEditor);

	const handleClick = (e) => {
		setTempValue(e.currentTarget.textContent);
		setPrevValue(e.currentTarget.textContent);
		if (
			e.currentTarget &&
			e.currentTarget?.firstChild instanceof HTMLElement
		) {
			const computed =
				window.getComputedStyle(
					e.currentTarget?.firstChild,
				) || {};
			setInheritedStyles(
				Object.fromEntries(
					[
						"fontSize",
						"fontWeight",
						"fontFamily",
						"lineHeight",
						"color",
						"letterSpacing",
						"margin",
						"padding",
						"border",
						"borderRadius",
						"boxShadow",
						"outline",
					].map((prop) => [prop, computed[prop]]),
				),
			);
		}
		setIsEditing(true);
	};

	const handleInputChange = (e) => {
		const newValue = e.target.value;

		if (
			maxInputLength > 0 &&
			newValue.length > maxInputLength
		) {
			return;
		}

		setTempValue(newValue);
	};

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.select();
		}
	}, [isEditing, children]);

	if (isEditing) {
		const InputComponent = multiline ? TextArea : Input;

		return (
			<InputComponent
				name={inputName}
				ref={inputRef}
				className={styles.input}
				style={inheritedStyles}
				value={tempValue}
				onChange={handleInputChange}
				autoFocus
			/>
		);
	}

	return (
		<button
			className={clsx(className, styles.button)}
			onClick={handleClick}
			type="button"
		>
			{savedValue && isValidElement(children)
				? cloneElement(children, {}, savedValue)
				: children}
		</button>
	);
};
