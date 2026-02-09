import styles from "./SelectTagForm.module.css";
import clsx from "clsx";

import { Header } from "../../molecules/Header/Header";
import { ButtonBase } from "../../atoms/ButtonBase/ButtonBase";

import { EditIcon } from "../../../assets/icons/EditIcon/EditIcon";

export const SelectTagForm = ({
	tags,
	onToggleTaskTag,
	onClose,
	onEdit,
	className,
}) => {
	const handleSelect = async (tag) => {
		await onToggleTaskTag({
			id: tag.id,
			attach: !tag.checked,
		});
	};

	return (
		<div className={clsx(styles.form, className)}>
			<Header onClose={onClose} level={4}>
				Etiquetas
			</Header>

			<section className={styles.tagsSection}>
				{tags.map((tag) => (
					<div className={styles.tagContainer} key={tag.id}>
						<input
							onChange={async () => handleSelect(tag)}
							checked={tag.checked}
							id={tag.id}
							type="checkbox"
							className={styles.checkbox}
						/>

						<div className={styles.tagWrapper}>
							<label
								htmlFor={tag.id}
								style={{ "--bg-tag": tag.color }}
								className={styles.tag}
							>
								{tag.name}
								{tag.id}
							</label>

							<ButtonBase
								onClick={onEdit}
								className={styles.editButton}
							>
								<EditIcon className={styles.icon} />
							</ButtonBase>
						</div>
					</div>
				))}
			</section>

			<footer>
				<ButtonBase className={styles.addTagBtn}>
					Crear una etiqueta nueva
				</ButtonBase>
			</footer>
		</div>
	);
};
