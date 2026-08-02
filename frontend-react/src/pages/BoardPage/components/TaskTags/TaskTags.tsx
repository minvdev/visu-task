import styles from "./TaskTags.module.css";
import clsx from "clsx";

import {
	type ComponentPropsWithoutRef,
	type MouseEvent,
	type ComponentRef,
} from "react";

import { Tag } from "@pages/BoardPage/components/Tag/Tag";

import type { components } from "@/types/open-api-schema";
type TaskTagsSchema = components["schemas"]["Card"]["tags"];

export interface TaskTagsProps extends ComponentPropsWithoutRef<"div"> {
	tags: TaskTagsSchema;
	isCompactTags: boolean;
	onClickTag: (
		e: MouseEvent<ComponentRef<typeof Tag>>,
	) => void;
}

export const TaskTags = ({
	tags,
	isCompactTags,
	onClickTag,
	className,
	...props
}: TaskTagsProps) => {
	if (tags.length <= 0) return;

	return (
		<div
			className={clsx(styles["container"], className)}
			{...props}
		>
			{tags.map((tag) => (
				<Tag
					variant={isCompactTags ? "compact" : "full"}
					tag={tag}
					key={tag.id}
					onClick={onClickTag}
				/>
			))}
		</div>
	);
};
