import styles from "./FormField.module.css";
import { Label } from "@atoms/Label/Label";

import {
	type ComponentPropsWithoutRef,
	type ReactNode,
} from "react";

export interface FormFieldProps extends ComponentPropsWithoutRef<"div"> {
	label: string;
	htmlFor?: string | undefined;
	error?: string | undefined;
	children?: ReactNode;
	className?: string | undefined;
}

export const FormField = ({
	label,
	htmlFor,
	error,
	children,
	className,
}: FormFieldProps) => {
	return (
		<div className={className}>
			<Label htmlFor={htmlFor} className={styles["label"]}>
				{label}
			</Label>

			<div className={styles["control"]}>{children}</div>

			{error && (
				<span className={styles["error"]}>{error}</span>
			)}
		</div>
	);
};
