import styles from "./OptionMenu.module.css";
import clsx from "clsx";

import { Heading } from "../../atoms/Heading/Heading";

export const OptionMenu = ({
	options = [],
	heading,
	className,
}) => {
	return (
		<div className={clsx(styles.menu, className)}>
			<div className={styles.menuHeading}>{heading}</div>

			<div className={styles.menuContent}>
				{options.map((group, groupIndex) => (
					<div key={groupIndex} className={styles.group}>
						{group.heading && (
							<Heading
								className={styles.groupHeading}
								level={5}
							>
								{group.heading}
							</Heading>
						)}

						{group.options.map((option, optionIndex) => (
							<button
								key={optionIndex}
								onClick={option.onClick}
								className={styles.item}
								type="button"
							>
								{option.label}
							</button>
						))}

						{groupIndex < options.length - 1 && (
							<div className={styles.separator} />
						)}
					</div>
				))}
			</div>
		</div>
	);
};
