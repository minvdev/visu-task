import styles from "./Checkbox.module.css";
import clsx from "clsx";

import { CheckIcon } from "../../../assets/icons/CheckIcon/CheckIcon";

export const Checkbox = ({
	checked,
	onChange,
	className,
}) => {
	return (
		<button
			type="button"
			role="checkbox"
			aria-checked={checked}
			className={clsx(
				styles.checkbox,
				checked && styles.checked,
				className,
			)}
			onClick={onChange}
		>
			<CheckIcon className={styles.checkIcon} />
		</button>
	);
};
