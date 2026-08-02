import styles from "./Description.module.css";
import clsx from "clsx";

import { Heading } from "@atoms/HeadingV2/Heading";
import { EditableText } from "@components/molecules/EditableText/EditableText";
import { LucideTextAlignStart } from "lucide-react";

export interface DescriptionProps {
	description: string | null;
	onChange: (value: string) => void;
	onBlur: (value: string) => void;
	iconWrapperClassName?: string | undefined;
	className?: string | undefined;
}

export const Description = ({
	description,
	onChange,
	onBlur,
	iconWrapperClassName,
	className,
}: DescriptionProps) => {
	return (
		<div className={className}>
			<div
				className={clsx(
					styles["iconContainer"],
					iconWrapperClassName,
				)}
			>
				<LucideTextAlignStart className={styles["icon"]} />
				<Heading level={3}>Descripción</Heading>
			</div>

			<EditableText
				as="p"
				value={description || ""}
				placeholder="Añadir una descripción más detallada..."
				onChange={onChange}
				onBlur={onBlur}
				onFocus={(e) => e.target.select()}
				name="task-modal-description"
				multiline={true}
				className={clsx(
					styles["editableText"],
					!description && styles["placeholder"],
				)}
			/>
		</div>
	);
};
