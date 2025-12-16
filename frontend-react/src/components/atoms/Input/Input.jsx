import styles from "./Input.module.css";
import clsx from "clsx";

export const Input = ({
	type = "text",
	value = "",
	onChange,
	placeholder,
	variants = ["input-default"],
	className,
	...props
}) => {
	return (
		<input
			className={clsx(
				styles.input,
				variants.map((variant) => styles[variant]),
				className
			)}
			type={type}
			onChange={onChange}
			placeholder={placeholder}
			value={value}
			{...props}
		/>
	);
};
