import styles from "./TagList.module.css";
import clsx from "clsx";

import { Header } from "../../molecules/Header/Header";
import { ButtonBase } from "../../atoms/ButtonBase/ButtonBase";

import { EditIcon } from "../../../assets/icons/EditIcon/EditIcon";
import { tagColors } from "../../../constants/tagColors";

export const TagList = ({
	tags,
	onClose,
	onOpenCreateTag,
	onOpenEditTag,
	className,
}) => {
	const handleCreateTag = () => {
		onClose();
		onOpenCreateTag();
	};

	const handleEditTag = (tag) => () => {
		onClose();
		onOpenEditTag(tag);
	};

	const normalizeTagColors = (tag) => {
		const matchingColorOption = tagColors.find(
			(colorOption) =>
				colorOption.backgroundColor === tag.color,
		);
		if (!matchingColorOption) return tag;
		return {
			...tag,
			color: matchingColorOption.color,
			backgroundColor: matchingColorOption.backgroundColor,
		};
	};

	return (
		<div className={clsx(styles.form, className)}>
			<Header onClose={onClose} level={4}>
				Etiquetas
			</Header>

			<section className={styles.tagsSection}>
				{tags.map((t) => {
					const tag = normalizeTagColors(t);
					return (
						<div
							className={styles.tagContainer}
							key={tag.id}
						>
							<ButtonBase
								onClick={handleEditTag(t)}
								style={{
									"--bg-tag": tag.backgroundColor,
									"--text-tag": tag.color,
								}}
								className={styles.tag}
							>
								{tag.name}
							</ButtonBase>

							<ButtonBase
								onClick={handleEditTag(t)}
								className={styles.editButton}
							>
								<EditIcon className={styles.icon} />
							</ButtonBase>
						</div>
					);
				})}
			</section>

			<footer>
				<ButtonBase
					className={styles.addTagBtn}
					onClick={handleCreateTag}
				>
					Crear una etiqueta nueva
				</ButtonBase>
			</footer>
		</div>
	);
};
