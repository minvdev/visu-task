import styles from "./Title.module.css";
import clsx from "clsx";

import { Checkbox } from "@atoms/Checkbox/Checkbox";
import { EditableText } from "@components/molecules/EditableText/EditableText";

export interface TitleProps {
	checked: boolean;
	onCheck: () => void;
	isCheckDisabled: boolean;
	title: string;
	onChange: (value: string) => void;
	onBlur: (value: string) => void;
	className?: string | undefined;
}

export const Title = ({
	checked,
	onCheck,
	isCheckDisabled,
	title,
	onChange,
	onBlur,
	className,
}: TitleProps) => {
	return (
		<div className={clsx(styles["container"], className)}>
			<div className={styles["checkbox"]}>
				<Checkbox
					onClick={onCheck}
					checked={checked}
					disabled={isCheckDisabled}
				/>
			</div>

			<EditableText
				as="h2"
				value={title}
				onChange={onChange}
				onBlur={onBlur}
				name="task-modal-name"
				multiline={true}
				className={styles["editableName"]}
			/>
		</div>
	);
};
