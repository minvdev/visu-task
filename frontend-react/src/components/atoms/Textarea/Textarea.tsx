import { type ComponentPropsWithRef } from "react";
import styles from "./Textarea.module.css";
import clsx from "clsx";

export interface TextareaProps extends ComponentPropsWithRef<"textarea"> {
	defaultStyles?: boolean;
}

export const Textarea = ({
	defaultStyles = true,
	className,
	...props
}: TextareaProps) => {
	return (
		<textarea
			className={clsx(
				styles["textarea"],
				defaultStyles && styles["default"],
				className,
			)}
			rows={1}
			{...props}
		/>
	);
};
