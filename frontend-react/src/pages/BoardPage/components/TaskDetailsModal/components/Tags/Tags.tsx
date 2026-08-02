import styles from "./Tags.module.css";

import { useRef, type CSSProperties } from "react";
import { useTags } from "./useTags";
import { useVerticalOffset } from "@hooks/useVerticalOffset";

import { SelectTagForm } from "../SelectTagForm/SelectTagForm";
import { Tag } from "@pages/BoardPage/components/Tag/Tag";
import { Heading } from "@atoms/HeadingV2/Heading";
import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import { Popover } from "@atoms/Popover/Popover";
import { CreateTagForm } from "@pages/BoardPage/components/CreateTagForm/CreateTagForm";
import { EditTagForm } from "@pages/BoardPage/components/EditTagForm/EditTagForm";
import { LucidePlus } from "lucide-react";

import { components } from "@/types/open-api-schema";
type TaskSubschema = components["schemas"]["CardSubschema"];
type TaskTag = TaskSubschema["tags"][number];

export interface TagsProps {
	task: TaskSubschema;
	className?: string | undefined;
}

export const Tags = ({ task, className }: TagsProps) => {
	const {
		activeView,
		setActiveView,
		handleSuccessCreateTag,
		handleAttachTag,
		handleDetachTag,
	} = useTags(task);

	const containerRef = useRef<HTMLDivElement | null>(null);
	const popoverRef = useRef<HTMLDivElement | null>(null);
	const popoverOffset = useVerticalOffset(
		containerRef,
		popoverRef,
		[activeView, task.tags],
	);

	return (
		<div className={className}>
			<Heading level={4} className={styles["heading"]}>
				Etiquetas
			</Heading>

			<div className={styles["main"]} ref={containerRef}>
				<div className={styles["tagsContainer"]}>
					{task.tags.map((tag) => (
						<ButtonBase
							onClick={() =>
								setActiveView({ view: "select-tag" })
							}
							key={tag.id}
							className={styles["tagWrapper"]}
						>
							<Tag
								tag={tag}
								textSize={"normal"}
								className={styles["tag"]}
							/>
						</ButtonBase>
					))}

					<ButtonBase
						onClick={() =>
							setActiveView({ view: "select-tag" })
						}
						className={styles["add"]}
					>
						<LucidePlus size={18} />
					</ButtonBase>
				</div>

				{activeView && (
					<Popover
						onClick={(e) => e.stopPropagation()}
						onClose={() => setActiveView(null)}
						rightClass={styles["popoverLoc"]}
						bottomClass={styles["popoverLoc"]}
						className={styles["popover"]}
						ref={popoverRef}
						style={
							{
								["--popover-offset"]:
									popoverOffset > 0
										? `calc(${popoverOffset}px + var(--space-2))` // --space-2 accounts for the top margin
										: undefined,
							} as CSSProperties
						}
					>
						{activeView.view === "create-tag" && (
							<CreateTagForm
								onClose={() => setActiveView(null)}
								onBack={activeView?.onBack}
								onSuccess={handleSuccessCreateTag}
								style={
									{
										["--create-tag-max-height"]:
											"var(--modal-item-max-height)",
									} as CSSProperties
								}
							/>
						)}

						{activeView.view === "edit-tag" && (
							<EditTagForm
								onClose={() => setActiveView(null)}
								onBack={activeView?.onBack}
								onSuccess={() =>
									setActiveView({ view: "select-tag" })
								}
								tag={activeView.tag}
								style={
									{
										["--edit-tag-max-height"]:
											"var(--modal-item-max-height)",
									} as CSSProperties
								}
							/>
						)}

						{activeView.view === "select-tag" && (
							<SelectTagForm
								onClose={() => setActiveView(null)}
								onAttachTag={handleAttachTag}
								onDetachTag={handleDetachTag}
								onEditTag={(tag: TaskTag) =>
									setActiveView({
										view: "edit-tag",
										tag,
										onBack: () =>
											setActiveView({
												view: "select-tag",
											}),
									})
								}
								onCreateTag={() =>
									setActiveView({
										view: "create-tag",
										onBack: () =>
											setActiveView({ view: "select-tag" }),
									})
								}
								task={task}
							/>
						)}
					</Popover>
				)}
			</div>
		</div>
	);
};
