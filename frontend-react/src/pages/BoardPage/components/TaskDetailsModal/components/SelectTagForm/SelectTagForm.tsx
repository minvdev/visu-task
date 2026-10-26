import styles from "./SelectTagForm.module.css";
import clsx from "clsx";

import { RefObject, useMemo } from "react";
import { useBoardState } from "@hooks/useBoard";

import { Checkbox } from "@atoms/Checkbox/Checkbox";
import { Tag } from "@pages/BoardPage/components/Tag/Tag";
import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import { Button } from "@atoms/Button/Button";
import { MenuHeader } from "@molecules/MenuHeader/MenuHeader";
import { LucideSquarePen } from "lucide-react";

import { components } from "@/types/open-api-schema";
type TagSubschema = components["schemas"]["TagSubschema"];
type TaskSubschema = components["schemas"]["CardSubschema"];
interface ExtendedTag extends TagSubschema {
	checked: boolean;
}

export interface SelectTagFormProps {
	onClose: () => void;
	onAttachTag: (id: number) => void;
	onDetachTag: (id: number) => void;
	onEditTag: (tag: TagSubschema) => void;
	onCreateTag: () => void;
	task: TaskSubschema;
	ref?: RefObject<HTMLDivElement | null>;
	className?: string | undefined;
}

export const SelectTagForm = ({
	onAttachTag,
	onDetachTag,
	onCreateTag,
	onEditTag,
	onClose,
	task,
	ref,
	className,
}: SelectTagFormProps) => {
	const board = useBoardState();

	const isTagInTask = useMemo(
		() =>
			(tagId: TagSubschema["id"], task: TaskSubschema) => {
				if (task.tags.find((t) => t.id === tagId))
					return true;
				return false;
			},
		[],
	);

	const tags = board.tags.map((tag) => ({
		...tag,
		checked: isTagInTask(tag.id, task),
	}));

	const handleTagToggle = (tag: ExtendedTag) =>
		tag.checked ? onDetachTag(tag.id) : onAttachTag(tag.id);

	return (
		<div
			className={clsx(styles["container"], className)}
			ref={ref}
		>
			<MenuHeader
				title="Etiquetas"
				onClose={onClose}
				className={styles["header"]}
			/>

			<section className={styles["tags"]}>
				{tags.map((tag) => (
					<div
						className={styles["tagContainer"]}
						key={tag.id}
					>
						<Checkbox
							onClick={() => handleTagToggle(tag)}
							checked={tag.checked}
							shape="square"
							className={styles["checkbox"]}
						/>

						<div className={styles["tagWrapper"]}>
							<ButtonBase
								onClick={() => handleTagToggle(tag)}
							>
								<Tag
									tag={tag}
									variant="full"
									textSize="normal"
									className={styles["tag"]}
								/>
							</ButtonBase>

							<ButtonBase
								className={styles["editTag"]}
								onClick={() => onEditTag(tag)}
							>
								<LucideSquarePen />
							</ButtonBase>
						</div>
					</div>
				))}
			</section>

			<footer>
				<Button
					onClick={onCreateTag}
					variants={["transparent"]}
					className={styles["createTag"]}
				>
					Crear una etiqueta nueva
				</Button>
			</footer>
		</div>
	);
};
