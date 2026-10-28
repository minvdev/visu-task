import styles from "./TagList.module.css";
import clsx from "clsx";

import {
	Tag,
	type TagProps,
} from "@pages/BoardPage/components/Tag/Tag";
import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import { Button } from "@atoms/Button/Button";
import { MenuHeader } from "@molecules/MenuHeader/MenuHeader";

import { ComponentPropsWithoutRef } from "react";
import { useBoardState } from "@hooks/useBoard";

import { LucideSquarePen } from "lucide-react";

export interface TagListProps extends ComponentPropsWithoutRef<"div"> {
	onClose: () => void;
	onBack: () => void;
	onEditTag: (tag: TagProps["tag"]) => void;
	onCreateTag: () => void;
}

export const TagList = ({
	onClose,
	onBack,
	onEditTag,
	onCreateTag,
	className,
}: TagListProps) => {
	const { tags } = useBoardState();
	return (
		<div className={clsx(styles["container"], className)}>
			<MenuHeader
				title="Etiquetas"
				onClose={onClose}
				onBack={onBack}
				className={styles["header"]}
			/>

			<section className={styles["section"]}>
				{tags.map((t) => (
					<div className={styles["tagWrapper"]} key={t.id}>
						<ButtonBase onClick={() => onEditTag(t)}>
							<Tag
								tag={t}
								variant="full"
								textSize="normal"
								className={styles["tag"]}
							/>
						</ButtonBase>

						<ButtonBase
							className={styles["editButton"]}
							onClick={() => onEditTag(t)}
						>
							<LucideSquarePen />
						</ButtonBase>
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
