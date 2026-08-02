import styles from "./ListSelector.module.css";
import clsx from "clsx";

import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import { LucideChevronDown } from "lucide-react";

export interface ListSelectorProps {
	name: string;
	className?: string;
}

export const ListSelector = ({
	name,
	className,
}: ListSelectorProps) => {
	return (
		<ButtonBase
			className={clsx(styles["container"], className)}
			disabled={true}
		>
			<span className={styles["text"]}>{name}</span>
			<LucideChevronDown />
		</ButtonBase>
	);
};
