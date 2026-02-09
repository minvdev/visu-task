import styles from "./Header.module.css";
import clsx from "clsx";

import { Heading } from "../../atoms/Heading/Heading";
import { ButtonBase } from "../../atoms/ButtonBase/ButtonBase";

import { CancelIcon } from "../../../assets/icons/CancelIcon/CancelIcon";

export const Header = ({
	onClose,
	level = 1,
	children,
	className,
	props,
}) => {
	const iconSize = Math.max(16, 30 - 4 * (level - 1));
	const buttonMargin = level > 3 ? 4 : 8;

	return (
		<header
			className={clsx(styles.header, className)}
			style={{
				"--icon-size": `${iconSize}px`,
				"--button-margin": `${buttonMargin}px`,
			}}
			{...props}
		>
			<Heading className={styles.heading} level={level}>
				{children}
			</Heading>

			{onClose && (
				<ButtonBase
					className={styles.button}
					onClick={onClose}
				>
					<CancelIcon
						className={clsx(
							styles.icon,
							level > 3 && styles.stroke,
						)}
					/>
				</ButtonBase>
			)}
		</header>
	);
};
