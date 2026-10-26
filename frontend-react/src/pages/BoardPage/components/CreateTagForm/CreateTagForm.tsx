import styles from "./CreateTagForm.module.css";
import clsx from "clsx";

import { ComponentPropsWithRef } from "react";
import { useCreateTagForm } from "./useCreateTagForm";

import { Tag } from "@pages/BoardPage/components/Tag/Tag";
import { Input } from "@atoms/InputV2/Input";
import { Button } from "@atoms/Button/Button";
import { FormField } from "@molecules/FormField/FormField";
import { MenuHeader } from "@molecules/MenuHeader/MenuHeader";
import { TagColorPicker } from "@pages/BoardPage/components/TagColorPicker/TagColorPicker";

export interface CreateTagFormProps extends Omit<
	ComponentPropsWithRef<"form">,
	"onSubmit"
> {
	onClose: () => void;
	onBack?: (() => void) | undefined;
	onSuccess?:
		| ((id: number) => Promise<void> | void)
		| undefined;
}

export const CreateTagForm = ({
	onClose,
	onBack,
	onSuccess,
	className,
	...props
}: CreateTagFormProps) => {
	const {
		tag,
		isLoading,
		handleNameChange,
		handleColorChange,
		handleSubmit,
	} = useCreateTagForm(onSuccess);

	return (
		<form
			onSubmit={handleSubmit}
			className={clsx(styles["form"], className)}
			{...props}
		>
			<MenuHeader
				title="Crear etiqueta"
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

				<footer>
					<Button
						type="submit"
						variants={["primary", "button-md"]}
						disabled={isLoading}
					>
						Crear
					</Button>
				</footer>
			</main>
		</form>
	);
};
