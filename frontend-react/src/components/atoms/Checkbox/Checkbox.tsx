import styles from "./Checkbox.module.css";
import clsx from "clsx";

import { type ComponentPropsWithoutRef } from "react";
import { LucideCheck } from "lucide-react";

export interface CheckboxProps extends Omit<
	ComponentPropsWithoutRef<"button">,
	"type" | "role" | "aria-checked"
> {
	checked: boolean;
}

export const Checkbox = ({
	checked,
	className,
	...props
}: CheckboxProps) => {
	return (
		<button
			type="button"
			role="checkbox"
			aria-checked={checked}
			className={clsx(
				styles["checkbox"],
				checked && styles["checked"],
				className,
			)}
			{...props}
		>
			<LucideCheck className={styles["checkIcon"]} />
		</button>
	);
};
