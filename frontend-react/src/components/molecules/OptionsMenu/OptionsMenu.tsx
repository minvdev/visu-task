import styles from "./OptionsMenu.module.css";
import clsx from "clsx";

import { PropsWithChildren } from "react";
import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";

type Option = {
	text: string;
	action: () => void;
	disabled?: boolean;
	closeOnSelect?: boolean;
};

type OptionGroup = {
	heading?: string;
	options: Array<Option>;
};

export type Options = Array<OptionGroup>;

export interface OptionsMenuProps extends PropsWithChildren {
	options: Options;
	onClose: () => void;
	className?: string | undefined;
}

export const OptionsMenu = ({
	options: actions,
	onClose,
	className,
	children,
}: OptionsMenuProps) => {
	function handleClick(option: Option) {
		option.action();
		if (option.closeOnSelect) onClose();
	}

	return (
		<div
			className={clsx(
				styles["container"],
				children && styles["withHeader"],
				className,
			)}
		>
			{children && (
				<div className={styles["header"]}>{children}</div>
			)}

			<div className={styles["content"]}>
				{actions.map((optionGroup, index) => {
					const totalGroups = actions.length;
					const { heading, options } = optionGroup;
					return (
						<div key={index}>
							<section className={styles["group"]}>
								{heading && (
									<h3 className={styles["groupHeading"]}>
										{heading}
									</h3>
								)}
								{options.map((option, i) => (
									<ButtonBase
										className={styles["option"]}
										onClick={() => handleClick(option)}
										disabled={option.disabled}
										key={i}
									>
										{option.text}
									</ButtonBase>
								))}
							</section>
							{index < totalGroups - 1 && (
								<div className={styles["separator"]} />
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};
