import styles from "./EditTagForm.module.css";
import clsx from "clsx";

import { useState } from "react";

import { Header } from "../../molecules/Header/Header";
import { FormField } from "../../molecules/FormField/FormField";
import { Input } from "../../atoms/Input/Input";
import { ButtonBase } from "../../atoms/ButtonBase/ButtonBase";
import { Button } from "../../atoms/Button/Button";

import { CheckIcon } from "../../../assets/icons/CheckIcon/CheckIcon";
import { tagColors } from "../../../constants/tagColors";

export const EditTagForm = ({
	tag,
	onSubmit,
	onDelete,
	onClose,
	className,
}) => {
	const [name, setName] = useState(tag.name || "");
	const [selectedColor, setSelectedColor] = useState(
		tagColors.find(
			(color) => color.backgroundColor === tag.color,
		) || tagColors[0],
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		let body = { color: selectedColor.backgroundColor };
		const trimmedName = name.trim();
		if (trimmedName) body = { ...body, name: trimmedName };
		onSubmit({ id: tag.id, body });
		onClose();
	};

	const handleDelete = () => {
		onDelete(tag.id);
		onClose();
	};

	const handleChange = (e) => {
		const newValue = e.target.value;
		if (newValue.length > 50) {
			return;
		}
		setName(newValue);
	};

	const handleColorChange = (color) => () => {
		setSelectedColor(color);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={clsx(styles.form, className)}
		>
			<Header onClose={onClose} level={4}>
				Editar etiqueta
			</Header>

			<section className={styles.previewContainer}>
				<div
					className={styles.preview}
					style={{
						backgroundColor: selectedColor.backgroundColor,
						color: selectedColor.color,
					}}
				>
					<span>{name}</span>
				</div>
			</section>

			<section>
				<FormField label={"Título"} htmlFor={"title"}>
					<Input
						id="title"
						name="title"
						value={name}
						onChange={handleChange}
						className={styles.titleInput}
					/>
				</FormField>
			</section>

			<section>
				<FormField
					label={"Selecciona un color"}
					htmlFor={"color"}
				>
					<ul className={styles.colorList} id="color">
						{tagColors.map((color) => (
							<li
								className={styles.colorItem}
								style={{
									backgroundColor: color.backgroundColor,
								}}
								key={color.id}
							>
								<ButtonBase
									className={styles.colorButton}
									onClick={handleColorChange(color)}
								>
									<CheckIcon
										className={clsx(
											styles.selectedIcon,
											color.backgroundColor ===
												selectedColor.backgroundColor &&
												styles.selected,
										)}
									/>
								</ButtonBase>
							</li>
						))}
					</ul>
				</FormField>
			</section>

			<div className={styles.separator} />

			<footer className={styles.footer}>
				<Button
					className={styles.button}
					type="submit"
					variants={["primary", "button-md"]}
					disabled={!selectedColor}
				>
					Guardar
				</Button>
				<Button
					className={styles.button}
					type="button"
					variants={["danger", "button-md"]}
					disabled={!selectedColor}
					onClick={handleDelete}
				>
					Eliminar
				</Button>
			</footer>
		</form>
	);
};
