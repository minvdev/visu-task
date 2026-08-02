import styles from "./DueDate.module.css";
import clsx from "clsx";

import { CSSProperties, useRef } from "react";
import { useDueDate } from "./useDueDate";
import { useVerticalOffset } from "@hooks/useVerticalOffset";

import { Heading } from "@atoms/HeadingV2/Heading";
import { DueDate as DueDateCard } from "@atoms/DueDate/DueDate";
import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import { Popover } from "@atoms/Popover/Popover";
import { DateForm } from "@pages/BoardPage/components/DateFormV2/DateForm";
import {
	LucideChevronDown,
	LucidePlus,
} from "lucide-react";

import type { components } from "@/types/open-api-schema";
type TaskSubschema = components["schemas"]["CardSubschema"];

export interface DueDateProps {
	task: TaskSubschema;
	className?: string | undefined;
}

export const DueDate = ({
	task,
	className,
}: DueDateProps) => {
	const { isOpen, setIsOpen } = useDueDate();
	const formRef = useRef<HTMLFormElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const formOffset = useVerticalOffset(
		containerRef,
		formRef,
		[isOpen],
	);

	return (
		<div className={className}>
			<Heading level={4} className={styles["heading"]}>
				Vencimiento
			</Heading>

			<div ref={containerRef} className={styles["main"]}>
				<ButtonBase
					onClick={() => setIsOpen(true)}
					className={clsx(
						styles["cardContainer"],
						className,
					)}
				>
					{task.due_date ? (
						<>
							<DueDateCard
								due_date={task.due_date}
								is_done={task.is_done}
								variant="status"
							/>
							<LucideChevronDown />
						</>
					) : (
						<>
							<LucidePlus size={18} />
							Añadir fecha límite
						</>
					)}
				</ButtonBase>

				{isOpen && (
					<Popover
						onClick={(e) => e.stopPropagation()}
						onClose={() => setIsOpen(false)}
						rightClass={styles["popoverLocation"]}
						bottomClass={styles["popoverLocation"]}
						className={styles["popover"]}
						style={
							{
								["--popover-offset"]:
									formOffset > 0
										? `calc(${formOffset}px + var(--space-2))` // --space-2 accounts for the top margin
										: undefined,
							} as CSSProperties
						}
					>
						<DateForm
							onClose={() => setIsOpen(false)}
							task={task}
							ref={formRef}
							style={
								{
									["--date-form-max-height"]:
										"var(--modal-item-max-height)",
								} as CSSProperties
							}
						/>
					</Popover>
				)}
			</div>
		</div>
	);
};
