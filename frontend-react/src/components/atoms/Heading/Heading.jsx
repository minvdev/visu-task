import styles from "./Heading.module.css";
import clsx from "clsx";

export const Heading = ({
	level = 1,
	children,
	variants = ["primary"],
	className,
	...props
}) => {
	const safeLevel = Math.min(Math.max(level, 1), 6);
	const Tag = `h${safeLevel}`;

	return (
		<Tag
			className={clsx(
				styles.heading,
				styles[`h${safeLevel}`],
				variants.map((variant) => styles[variant]),
				className
			)}
			{...props}
		>
			{children}
		</Tag>
	);
};
