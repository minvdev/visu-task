import styles from "./EditTagForm.module.css";
import clsx from "clsx";

import { ComponentPropsWithRef } from "react";
import { useEditTagForm } from "./useEditTagForm";

import {
	Tag,
	type TagProps,
} from "@pages/BoardPage/components/Tag/Tag";
import { Input } from "@atoms/InputV2/Input";
import { Button } from "@atoms/Button/Button";
import { FormField } from "@molecules/FormField/FormField";
import { MenuHeader } from "@molecules/MenuHeader/MenuHeader";
import { TagColorPicker } from "@pages/BoardPage/components/TagColorPicker/TagColorPicker";

export interface EditTagFormProps extends Omit<
	ComponentPropsWithRef<"form">,
	"onSubmit"
> {
	tag: TagProps["tag"];
	onClose?: (() => void) | undefined;
	onBack?: (() => void) | undefined;
	onSuccess?: (() => Promise<void> | void) | undefined;
}

export const EditTagForm = ({
	tag: initialTag,
	onClose,
	onBack,
	onSuccess,
	className,
	...props
}: EditTagFormProps) => {
	const {
		tag,
		isLoading,
		handleNameChange,
		handleColorChange,
		handleSubmit,
		handleDelete,
	} = useEditTagForm(initialTag, onSuccess);

	return (
		<form
			onSubmit={handleSubmit}
			className={clsx(styles["form"], className)}
			{...props}
		>
			<MenuHeader
				title="Editar etiqueta"
				onClose={onClose}
				onBack={onBack}
				className={styles["header"]}
			/>

			<main className={styles["main"]}>
				<section className={styles["previewContainer"]}>
					<Tag
						tag={tag}
						variant="full"
						textSize="normal"
						className={styles["preview"]}
					/>
				</section>

				<section>
					<FormField label={"Título"} htmlFor={"title"}>
						<Input
							value={tag.name ?? ""}
							onChange={handleNameChange}
							id="title"
							name="title"
							className={styles["titleInput"]}
							autoFocus
						/>
					</FormField>
				</section>

				<section>
					<FormField label={"Selecciona un color"}>
						<TagColorPicker
							selectedColor={tag.color}
							onColorChange={handleColorChange}
						/>
					</FormField>
				</section>

				<div className={styles["separator"]} />

				<footer className={styles["footer"]}>
					<Button
						type="submit"
						variants={["primary", "button-md"]}
						disabled={isLoading}
					>
						Guardar
					</Button>

					<Button
						onClick={handleDelete}
						type="button"
						variants={["danger", "button-md"]}
						disabled={isLoading}
					>
						Eliminar
					</Button>
				</footer>
			</main>
		</form>
	);
};
