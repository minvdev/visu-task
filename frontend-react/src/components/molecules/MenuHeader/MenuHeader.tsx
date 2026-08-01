import styles from "./MenuHeader.module.css";
import clsx from "clsx";

import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import { Heading } from "@atoms/HeadingV2/Heading";
import { CloseButton } from "@atoms/CloseButton/CloseButton";

import { LucideChevronLeft } from "lucide-react";

export interface MenuHeaderProps {
	title: string;
	onClose?: (() => void) | undefined;
	onBack?: (() => void) | undefined;
	className?: string | undefined;
}

export const MenuHeader = ({
	title,
	onClose,
	onBack,
	className,
}: MenuHeaderProps) => {
	return (
		<header
			className={clsx(styles["container"], className)}
		>
			{onBack ? (
				<ButtonBase
					onClick={onBack}
					className={styles["backButton"]}
					aria-label="Volver atrás"
				>
					<LucideChevronLeft strokeWidth={1.8} />
				</ButtonBase>
			) : (
				<div />
			)}

			<Heading level={4} className={styles["title"]}>
				{title}
			</Heading>

			<CloseButton
				onClick={onClose}
				className={styles["closeButton"]}
				size={32}
			/>
		</header>
	);
};
