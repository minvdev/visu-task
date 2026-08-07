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
			<Label htmlFor={htmlFor}>{label}</Label>

			{children}

			{error && <span>{error}</span>}
		</div>
	);
};
