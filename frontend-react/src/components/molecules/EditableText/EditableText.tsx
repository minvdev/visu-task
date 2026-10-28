import styles from "./EditableText.module.css";
import clsx from "clsx";

import {
	ChangeEvent,
	FocusEvent,
	KeyboardEvent,
	JSX,
} from "react";
import { useEditableText } from "./useEditableText";

import { Input } from "@atoms/InputV2/Input";
import { Textarea } from "@atoms/Textarea/Textarea";

export interface EditableTextProps {
	value: string;
	onChange: (newValue: string) => void;
	onBlur?: (finalValue: string) => void;
	onFocus?: (
		e: FocusEvent<
			HTMLInputElement | HTMLTextAreaElement,
			Element
		>,
	) => void;
	as?: keyof JSX.IntrinsicElements;
	multiline?: boolean;
	placeholder?: string;
	className?: string | undefined;
	name?: string;
}

export const EditableText = ({
	value,
	onChange,
	onBlur,
	onFocus,
	as,
	multiline = false,
	placeholder,
	className,
	name,
}: EditableTextProps) => {
	const { isEditing, startEditing, stopEditing } =
		useEditableText();

	const TextElement = as ?? "p";

	const sharedProps = {
		value,
		onChange: (
			e: ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement
			>,
		) => onChange(e.target.value),
		onBlur: (
			e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
		) => {
			stopEditing();
			onBlur?.(e.target.value);
		},
		onKeyDown: (
			e: KeyboardEvent<
				HTMLInputElement | HTMLTextAreaElement
			>,
		) => {
			if (["Escape", "Enter"].includes(e.key)) {
				e.preventDefault();
				(e.target as HTMLInputElement).blur();
			}
		},
		onFocus,
		autoFocus: true,
		placeholder,
		name,
		className: clsx(styles["inputComponent"], className),
	};

	if (isEditing) {
		return multiline ? (
			<Textarea {...sharedProps} defaultStyles={false} />
		) : (
			<Input {...sharedProps} defaultStyles={false} />
		);
	}

	return (
		<TextElement
			onClick={startEditing}
			className={clsx(styles["text"], className)}
		>
			{value || placeholder}
		</TextElement>
	);
};
