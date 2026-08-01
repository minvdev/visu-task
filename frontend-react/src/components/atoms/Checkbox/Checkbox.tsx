import styles from "./Checkbox.module.css";
import clsx from "clsx";

import { type ComponentPropsWithoutRef } from "react";
import { LucideCheck } from "lucide-react";

export type CheckboxShape = "circle" | "square";

export interface CheckboxProps extends Omit<
	ComponentPropsWithoutRef<"button">,
	"type" | "role" | "aria-checked"
> {
	checked: boolean;
	shape?: CheckboxShape;
}

export const Checkbox = ({
	checked,
	className,
	shape = "circle",
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
				shape === "square" && styles["square"],
				className,
			)}
			{...props}
		>
			<LucideCheck className={styles["checkIcon"]} />
		</button>
	);
};
