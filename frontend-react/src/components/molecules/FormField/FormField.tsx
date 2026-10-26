import styles from "./FormField.module.css";

import { Label } from "@atoms/Label/Label";
import { Error } from "@components/atoms/Error/Error";

import {
	type ComponentPropsWithRef,
	type Key,
} from "react";

export interface FormFieldProps extends ComponentPropsWithRef<"div"> {
	label: string;
	htmlFor?: string | undefined;
	error?: string | undefined;
	errorKey?: Key | null | undefined;
}

export const FormField = ({
	label,
	htmlFor,
	error,
	errorKey,
	children,
	className,
	...props
}: FormFieldProps) => {
	return (
		<div className={className} {...props}>
			<Label htmlFor={htmlFor}>{label}</Label>

			{children}

			{error && (
				<Error
					message={error}
					className={styles["error"]}
					key={errorKey}
				/>
			)}
		</div>
	);
};
