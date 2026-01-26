import styles from "./TextArea.module.css";
import clsx from "clsx";

import { forwardRef } from "react";

export const TextArea = forwardRef(
	(
		{
			value = "",
			onChange,
			placeholder,
			className,
			...props
		},
		ref,
	) => {
		return (
			<textarea
				ref={ref}
				className={clsx(styles.textarea, className)}
				value={value ?? ""}
				onChange={onChange}
				placeholder={placeholder}
				rows={1}
				{...props}
			/>
		);
	},
);

TextArea.displayName = "TextArea";
