import styles from "./BoardOptions.module.css";
import clsx from "clsx";

import {
	useEffect,
	useRef,
	useState,
	useLayoutEffect,
} from "react";

import { Popover } from "../../atoms/Popover/Popover";
import { OptionMenu } from "../OptionMenu/OptionMenu";
import { Heading } from "../../atoms/Heading/Heading";
import { CreateTagForm } from "../CreateTagForm/CreateTagForm";
import { EditTagForm } from "../EditTagForm/EditTagForm";
import { TagList } from "../TagList/TagList";

export const BoardOptions = ({
	isOpen,
	onClose,
	ignoreElements,
	onDeleteBoard,
	tags,
	onTagCreate,
	onTagEdit,
	onTagDelete,
	className,
}) => {
	const [activePopovers, setActivePopovers] =
		useState(null);
	const [activeTag, setActiveTag] = useState(null);
	const [formStyle, setFormStyle] = useState(null);

	const containerRef = useRef(null);

	const getHeightToEnd = (ref) => {
		const windowHeight = window.innerHeight;
		const refBottom =
			ref.current.getBoundingClientRect().bottom;

		return windowHeight - refBottom;
	};

	const setExclusiveTrue = (stateObject, activeKey) => {
		return Object.keys(stateObject).reduce((acc, key) => {
			acc[key] = key === activeKey;
			return acc;
		}, {});
	};

	const displayTags = () => {
		setActivePopovers(
			setExclusiveTrue(activePopovers, "isShowingTags"),
		);
	};

	const displayMenu = () => {
		setActivePopovers(
			setExclusiveTrue(activePopovers, "isShowingMenu"),
		);
	};

	const displayCreateTag = () => {
		setActivePopovers(
			setExclusiveTrue(activePopovers, "isCreatingTag"),
		);
	};

	const displayEditTag = (tag) => {
		setActiveTag(tag);
		setActivePopovers(
			setExclusiveTrue(activePopovers, "isEditingTag"),
		);
	};

	const options = [
		{
			options: [
				{
					label: "Etiquetas",
					onClick: displayTags,
				},
			],
		},
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
				isShowingTags: false,
				isCreatingTag: false,
				isEditingTag: false,
			});
		};
		setupPop();
	}, [isOpen]);

	useLayoutEffect(() => {
		if (!containerRef.current) return;
		const calcStyles = {
			"--maxFormHeight": `calc(${getHeightToEnd(containerRef)}px - var(--space-11))`,
		};

		const setStyles = () => {
			setFormStyle(calcStyles);
		};

		setStyles();
	}, [tags, containerRef]);

	return (
		<div
			className={className}
			ref={containerRef}
			style={formStyle}
		>
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

					{activePopovers.isShowingTags && (
						<TagList
							tags={tags}
							onClose={displayMenu}
							onOpenCreateTag={displayCreateTag}
							onOpenEditTag={displayEditTag}
							className={styles.form}
						/>
					)}

					{activePopovers.isCreatingTag && (
						<CreateTagForm
							onSubmit={onTagCreate}
							onClose={displayTags}
							className={styles.form}
						/>
					)}

					{activePopovers.isEditingTag && (
						<EditTagForm
							onSubmit={onTagEdit}
							onDelete={onTagDelete}
							tag={activeTag}
							onClose={displayTags}
							className={styles.form}
						/>
					)}
				</Popover>
			)}
		</div>
	);
};
