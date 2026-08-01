import styles from "./Heading.module.css";
import clsx from "clsx";

import { ComponentPropsWithRef } from "react";

export interface HeadingProps extends ComponentPropsWithRef<"h1"> {
	level: 1 | 2 | 3 | 4 | 5 | 6;
}

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export const Heading = ({
	level,
	className,
	...props
}: HeadingProps) => {
	const Tag = `h${level}` as HeadingTag;

	return (
		<Tag
			className={clsx(styles["heading"], className)}
			{...props}
		/>
	);
};
