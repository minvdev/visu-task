import styles from "./Menu.module.css";
import clsx from "clsx";

import { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMenu, type Tag } from "./useMenu";

import { Popover } from "@atoms/Popover/Popover";
import { MenuToggle } from "@molecules/MenuToggle/MenuToggle";
import { OptionsMenu } from "@components/molecules/OptionsMenu/OptionsMenu";
import { MenuHeader } from "@molecules/MenuHeader/MenuHeader";
import { CreateTagForm } from "@pages/BoardPage/components/CreateTagForm/CreateTagForm";
import { EditTagForm } from "@pages/BoardPage/components/EditTagForm/EditTagForm";
import { TagList } from "@pages/BoardPage/components/TagList/TagList";

import type { Options } from "@components/molecules/OptionsMenu/OptionsMenu";

export interface MenuProps {
	className?: string | undefined;
}

export const Menu = ({ className }: MenuProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const {
		menuStyle,
		isLoading,
		activeView,
		setActiveView,
		handleBoardDelete,
	} = useMenu(containerRef);

	const navigate = useNavigate();

	const openMenuView = () =>
		setActiveView({ type: "menu" });

	const openTagsView = () =>
		setActiveView({ type: "tags" });

	const openCreateView = () =>
		setActiveView({ type: "create-tag" });

	const openEditView = (tag: Tag) =>
		setActiveView({ type: "edit-tag", tag });

	const closeView = () => setActiveView(null);

	const options = useMemo<Options>(
		() => [
			{
				options: [
					{
						text: "Etiquetas",
						action: openTagsView,
						disabled: isLoading,
					},
				],
			},
			{
				options: [
					{
						text: "Eliminar tablero",
						action: async () => {
							await handleBoardDelete();
							navigate("/dashboard");
						},
						disabled: isLoading,
					},
				],
			},
		],
		[isLoading],
	);

	const menu = (
		<div ref={containerRef} style={menuStyle ?? undefined}>
			<Popover
				onClose={closeView}
				className={clsx(styles["popover"])}
				bottomClass={styles["popoverBottom"]}
			>
				{activeView && activeView.type === "menu" && (
					<OptionsMenu options={options}>
						<MenuHeader title="Menú" onClose={closeView} />
					</OptionsMenu>
				)}

				{activeView && activeView.type === "tags" && (
					<TagList
						onBack={openMenuView}
						onClose={closeView}
						onEditTag={openEditView}
						onCreateTag={openCreateView}
						className={styles["form"]}
					/>
				)}

				{activeView && activeView.type === "create-tag" && (
					<CreateTagForm
						onBack={openTagsView}
						onClose={closeView}
						onSuccess={openTagsView}
						className={styles["form"]}
					/>
				)}

				{activeView && activeView.type === "edit-tag" && (
					<EditTagForm
						tag={activeView.tag}
						onBack={openTagsView}
						onClose={closeView}
						onSuccess={openTagsView}
						className={styles["form"]}
					/>
				)}
			</Popover>
		</div>
	);

	return (
		<MenuToggle
			isOpen={activeView ? true : false}
			menu={menu}
			onClick={openMenuView}
			className={clsx(className)}
		/>
	);
};
