import styles from "./Card.module.css";
import clsx from "clsx";

import { type ComponentPropsWithRef } from "react";

export interface CardProps extends ComponentPropsWithRef<"div"> {}

export const Card = ({
	className,
	...props
}: CardProps) => {
	return (
		<div
			className={clsx(styles["container"], className)}
			{...props}
		/>
	);
};
