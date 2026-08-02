import styles from "./Label.module.css";
import clsx from "clsx";

import { ComponentPropsWithoutRef } from "react";

export interface LabelProps extends ComponentPropsWithoutRef<"label"> {}

export const Label = ({
	className,
	...props
}: LabelProps) => {
	return (
		<label
			className={clsx(styles["label"], className)}
			{...props}
		/>
	);
};
