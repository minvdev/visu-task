import styles from "./Tag.module.css";
import clsx from "clsx";

import {
	ComponentPropsWithRef,
	CSSProperties,
} from "react";
import { resolveTagColors } from "@pages/BoardPage/utils/resolveTagColors";

import type { components } from "@/types/open-api-schema";
type TagSubschema = components["schemas"]["TagSubschema"];

export interface TagProps extends ComponentPropsWithRef<"div"> {
	tag: TagSubschema;
	variant?: "compact" | "full";
	textSize?: "small" | "normal";
}

export const Tag = ({
	className,
	variant = "full",
	textSize = "small",
	tag,
	style,
	...props
}: TagProps) => {
	const resolvedTag = resolveTagColors(tag);
	return (
		<div
			className={clsx(
				className,
				styles["container"],
				variant === "full" && styles["full"],
				textSize !== "small" && styles[`text-${textSize}`],
			)}
			style={
				{
					...style,
					"--bg-tag": resolvedTag.backgroundColor,
					"--text-tag": resolvedTag.color,
				} as CSSProperties
			}
			{...props}
		>
			<span className={styles["text"]}>
				{resolvedTag.name}
			</span>
		</div>
	);
};
