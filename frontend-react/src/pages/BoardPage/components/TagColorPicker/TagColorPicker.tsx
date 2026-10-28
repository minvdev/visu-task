import styles from "./TagColorPicker.module.css";
import clsx from "clsx";

import { ComponentPropsWithoutRef } from "react";

import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import { LucideCheck } from "lucide-react";

import {
	tagColors,
	type TagColor,
} from "@constants/tagColors";
type Color = TagColor["backgroundColor"];

export interface TagColorPickerProps extends ComponentPropsWithoutRef<"ul"> {
	selectedColor: Color;
	onColorChange: (color: Color) => void;
}

export const TagColorPicker = ({
	selectedColor,
	onColorChange,
	className,
	...props
}: TagColorPickerProps) => {
	return (
		<ul
			className={clsx(styles["container"], className)}
			{...props}
		>
			{tagColors.map(({ backgroundColor, color }) => (
				<li
					className={clsx(
						styles["item"],
						color === "#fff"
							? styles["darkHoverFilter"]
							: styles["lightHoverFilter"],
					)}
					style={{ backgroundColor }}
					key={backgroundColor}
				>
					<ButtonBase
						onClick={() => onColorChange(backgroundColor)}
						className={styles["colorButton"]}
					>
						<LucideCheck
							className={clsx(
								styles["checkIcon"],
								selectedColor === backgroundColor &&
									styles["selected"],
							)}
							size={24}
							color="#fff"
						/>
					</ButtonBase>
				</li>
			))}
		</ul>
	);
};
