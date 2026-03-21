import styles from "./BoardOptions.module.css";
import clsx from "clsx";

import { useEffect, useRef, useState } from "react";

import { Popover } from "../../atoms/Popover/Popover";
import { OptionMenu } from "../OptionMenu/OptionMenu";
import { Heading } from "../../atoms/Heading/Heading";

export const BoardOptions = ({
	isOpen,
	onClose,
	ignoreElements,
	onDeleteBoard,
	className,
}) => {
	const [activePopovers, setActivePopovers] =
		useState(null);

	const containerRef = useRef(null);

	const options = [
		{
			options: [
				{
					label: "Eliminar tablero",
					onClick: onDeleteBoard,
				},
			],
		},
	];

	useEffect(() => {
		const setupPop = () => {
			setActivePopovers({
				isShowingMenu: true,
			});
		};
		setupPop();
	}, [isOpen]);

	return (
		<div className={className} ref={containerRef}>
			{isOpen && (
				<Popover
					onClose={onClose}
					ignoreElements={ignoreElements}
					className={clsx(styles.popover)}
					bottomClass={styles.popoverBottom}
				>
					{activePopovers.isShowingMenu && (
						<OptionMenu
							heading={
								<Heading level={4}>Acciones</Heading>
							}
							options={options}
						/>
					)}
				</Popover>
			)}
		</div>
	);
};
