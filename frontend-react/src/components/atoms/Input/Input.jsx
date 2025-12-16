import styles from "./Input.module.css";
import clsx from "clsx";

export const Input = ({
	type = "text",
	value = "",
	onChange,
	placeholder,
	className = "input-default",
	...props
}) => {
	return (
		<input
			className={clsx(styles.input, className)}
			type={type}
			onChange={onChange}
			placeholder={placeholder}
			value={value}
			{...props}
		/>
	);
};
