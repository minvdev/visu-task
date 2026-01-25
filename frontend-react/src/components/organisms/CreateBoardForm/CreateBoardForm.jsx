import styles from "./CreateBoardForm.module.css";
import clsx from "clsx";
import { Heading } from "../../atoms/Heading/Heading";
import { Button } from "../../atoms/Button/Button";
import { Image } from "../../atoms/Image/Image";
import { FormField } from "../../molecules/FormField/FormField";
import { Input } from "../../atoms/Input/Input";
import { useState } from "react";
import { CancelIcon } from "../../../assets/icons/CancelIcon/CancelIcon";
import { CheckIcon } from "../../../assets/icons/CheckIcon/CheckIcon";

export const CreateBoardForm = ({
	onSubmit,
	onCancel,
	backgrounds,
}) => {
	const [title, setTitle] = useState("");
	const [selectedImageId, setSelectedImageId] = useState(
		backgrounds[0].id,
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!title.trim()) return;
		onSubmit({ title: title, imageId: selectedImageId });
		setTitle("");
		setSelectedImageId(backgrounds[0].id);
	};

	const handleImageSelect = (id) => {
		const selectImage = () => {
			setSelectedImageId(id);
		};
		return selectImage;
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<div className={styles.header}>
				<Heading className={styles.title} level={4}>
					Crear tablero
				</Heading>
				<Button
					onClick={onCancel}
					className={styles.cancelBtn}
				>
					<CancelIcon className={styles.cancelIcon} />
				</Button>
			</div>

			<div className={styles.fieldsContainer}>
				<FormField label="Fondo">
					<div
						className={clsx(
							styles.backgroundPicker,
							styles.marginTop,
						)}
					>
						<div className={styles.backgroundList}>
							{backgrounds.map((bg) => (
								<div
									onClick={handleImageSelect(bg.id)}
									className={clsx(
										styles.imageContainer,
										selectedImageId === bg.id &&
											styles.selected,
									)}
									key={bg.id}
								>
									{selectedImageId === bg.id && (
										<CheckIcon
											className={styles.checkIcon}
										/>
									)}

									<Image
										className={styles.image}
										src={bg.image_url}
									/>
								</div>
							))}
						</div>
					</div>
				</FormField>

				<FormField
					label="Título del tablero"
					htmlFor="name"
				>
					<Input
						className={styles.marginTop}
						id="name"
						name="name"
						placeholder="Ej. Proyecto Web"
						autoFocus
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
						}}
					/>
				</FormField>
			</div>

			<div className={styles.actions}>
				<Button
					type="submit"
					disabled={!title.trim()}
					className={styles.submitBtn}
				>
					Crear
				</Button>
			</div>
		</form>
	);
};
