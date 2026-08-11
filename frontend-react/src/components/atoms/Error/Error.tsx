import styles from "./Error.module.css";
import clsx from "clsx";

import { type ComponentPropsWithRef } from "react";

export interface ErrorProps extends ComponentPropsWithRef<"div"> {
	message: string;
}

export const Error = ({
	message,
	className,
	...props
}: ErrorProps) => {
	return (
		<div
			className={clsx(styles["container"], className)}
			{...props}
		>
			{message}
		</div>
	);
};
