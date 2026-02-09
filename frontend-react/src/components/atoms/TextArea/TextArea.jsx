import styles from "./TextArea.module.css";
import clsx from "clsx";

export const TextArea = ({
	value = "",
	onChange,
	placeholder,
	className,
	ref,
	...props
}) => {
	return (
		<textarea
			ref={ref}
			className={clsx(styles.textarea, className)}
			value={value ?? ""}
			onChange={onChange}
			placeholder={placeholder}
			rows={1}
			{...props}
		/>
	);
};
