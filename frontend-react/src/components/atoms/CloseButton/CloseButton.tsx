import styles from "./CloseButton.module.css";
import clsx from "clsx";

import {
	ButtonBase,
	type ButtonBaseProps,
} from "@atoms/ButtonBase/ButtonBase";
import { LucideX } from "lucide-react";

export interface CloseButtonProps extends ButtonBaseProps {}

export const CloseButton = ({
	className,
	...props
}: CloseButtonProps) => {
	return (
		<ButtonBase
			className={clsx(className, styles["base"])}
			aria-label="Cerrar"
			{...props}
		>
			<LucideX className={styles["icon"]} />
		</ButtonBase>
	);
};
