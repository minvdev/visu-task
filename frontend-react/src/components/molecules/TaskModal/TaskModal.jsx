import styles from "./TaskModal.module.css";
import clsx from "clsx";

import {
	useEffect,
	useRef,
	useState,
	useMemo,
} from "react";

import { Modal } from "../../atoms/Modal/Modal";
import { ButtonBase } from "../../atoms/ButtonBase/ButtonBase";
import { Toggle } from "../../atoms/Toggle/Toggle";
import { Popover } from "../../atoms/Popover/Popover";
import { OptionMenu } from "../../organisms/OptionMenu/OptionMenu";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import { EditableText } from "../EditableText/EditableText";
import { Heading } from "../../atoms/Heading/Heading";
import { SelectTagForm } from "../../organisms/SelectTagForm/SelectTagForm";
import { DateForm } from "../../organisms/DateForm/DateForm";

import { DownIcon } from "../../../assets/icons/DownIcon/DownIcon";
import { ThreeDotsIcon } from "../../../assets/icons/ThreeDotsIcon/ThreeDotsIcon";
import { CancelIcon } from "../../../assets/icons/CancelIcon/CancelIcon";
import { DescriptionIcon } from "../../../assets/icons/DescriptionIcon/DescriptionIcon";
import { PlusIcon } from "../../../assets/icons/PlusIcon/PlusIcon";

export const TaskModal = ({
	task,
	board,
	onClose,
	onTaskUpdate,
	onTaskDelete,
	onToggleTaskTag,
	className,
}) => {
	const dialogRef = useRef(null);
	const optionsToggleRef = useRef(null);

	const [isOptionsPopoverOpen, setIsOptionsPopoverOpen] =
		useState(false);
	const [isDatePopoverOpen, setIsDatePopoverOpen] =
		useState(false);
	const [isTagPopoverOpen, setIsTagPopoverOpen] =
		useState(false);

	const allTags = board.tags.map((tag) => ({
		...tag,
		checked: task.tags.find(
			(attachedTag) => attachedTag.id === tag.id,
		)
			? true
			: false,
	}));

	const handleTaskDelete = () => {
		onTaskDelete();
		onClose();
	};

	const handleToggleCheckbox = (is_done) => {
		onTaskUpdate({ is_done });
	};

	const handleNameChange = (name) => {
		onTaskUpdate({ name });
	};

	const handleDescriptionChange = (description) => {
		onTaskUpdate({ description });
	};

	const handleDateUpdate = async (due_date) => {
		await onTaskUpdate({ due_date });
		setIsDatePopoverOpen(false);
	};

	const handleDateDelete = async () => {
		await onTaskUpdate({ due_date: null });
		setIsDatePopoverOpen(false);
	};

	const dateStatus = useMemo(() => {
		if (!task.due_date || task.is_done) return null;
		const due_date = new Date(task.due_date);
		const now = new Date();
		const diff = due_date - now;
		if (diff < 0)
			return {
				label: "Plazo vencido",
				style: styles.expired,
			};
		if (diff < 86400000)
			return {
				label: "Vence pronto",
				style: styles.upcoming,
			};
		return null;
	}, [task]);

	const convertDateToString = (dateString) => {
		const date = new Date(`${dateString}Z`);
		const options = {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
		};
		const formattedDateTime = new Intl.DateTimeFormat(
			navigator.language,
			options,
		).format(date);
		return formattedDateTime;
	};

	const menuOptions = [
		{
			options: [
				{
					label: "Eliminar tarea",
					onClick: handleTaskDelete,
				},
			],
		},
	];

	useEffect(() => dialogRef.current?.showModal(), []);

	return (
		<Modal
			ref={dialogRef}
			onClose={onClose}
			className={clsx(styles.modal, className)}
		>
			<div>
				<div className={styles.tab}>
					<ButtonBase
						className={styles.listBtn}
						disabled={true}
					>
						<span className={styles.listName}>
							{task.list.name}
						</span>

						<DownIcon />
					</ButtonBase>

					<div className={styles.actions}>
						<div className={styles.toggleWrapper}>
							<Toggle
								className={clsx(
									styles.button,
									styles.optionsButton,
									isOptionsPopoverOpen && styles.toggled,
								)}
								onToggleOn={() =>
									setIsOptionsPopoverOpen(true)
								}
								onToggleOff={() =>
									setIsOptionsPopoverOpen(false)
								}
								isToggled={isOptionsPopoverOpen}
								ref={optionsToggleRef}
							>
								<ThreeDotsIcon
									className={styles.mediumIcon}
								/>
							</Toggle>

							{isOptionsPopoverOpen && (
								<Popover
									onClose={() =>
										setIsOptionsPopoverOpen(false)
									}
									className={styles.popover}
									bottomClass={styles.popoverLeft}
									ignoreElements={[optionsToggleRef]}
								>
									<OptionMenu options={menuOptions} />
								</Popover>
							)}
						</div>

						<ButtonBase
							onClick={onClose}
							className={clsx(
								styles.button,
								styles.closeButton,
							)}
						>
							<CancelIcon className={styles.largeIcon} />
						</ButtonBase>
					</div>
				</div>

				<div className={styles.content}>
					<section
						className={clsx(
							styles.section,
							styles.sectionGrid,
						)}
					>
						<Checkbox
							className={styles.checkbox}
							checked={task?.is_done || false}
							onChange={() =>
								handleToggleCheckbox(!task.is_done)
							}
						/>

						<EditableText
							className={styles.editableText}
							inputName={`Task input ${task.id}`}
							onSave={handleNameChange}
							multiline={true}
						>
							<Heading
								className={styles.taskName}
								level={1}
							>
								{task.name}
							</Heading>
						</EditableText>
					</section>

					<section
						className={clsx(
							styles.section,
							styles.sectionFlex,
						)}
					>
						<div className={styles.headingWrapper}>
							<Heading level={6}>Etiquetas</Heading>
							<div className={styles.chipsContainer}>
								{task.tags.map((tag) => (
									<ButtonBase
										onClick={() =>
											setIsTagPopoverOpen(true)
										}
										className={styles.chip}
										style={{ "--bg-chip": tag.color }}
										key={tag.id}
									>
										<div className={styles.tagName}>
											{tag.name && tag.name}
										</div>
									</ButtonBase>
								))}

								<ButtonBase
									onClick={() => setIsTagPopoverOpen(true)}
								>
									<div className={styles.chip}>
										<PlusIcon />
										{task.tags.length <= 0 &&
											"Añadir etiqueta"}
									</div>
								</ButtonBase>
								{isTagPopoverOpen && (
									<Popover
										onClose={() =>
											setIsTagPopoverOpen(false)
										}
										className={clsx(
											styles.popover,
											styles.tagPopover,
										)}
										bottomClass={styles.popoverLeft}
									>
										<SelectTagForm
											tags={allTags}
											onToggleTaskTag={onToggleTaskTag}
											onClose={() =>
												setIsTagPopoverOpen(false)
											}
											className={styles.form}
										/>
									</Popover>
								)}
							</div>
						</div>

						<div className={styles.headingWrapper}>
							<Heading level={6}>Vencimiento</Heading>
							<div className={styles.chipsContainer}>
								<ButtonBase
									onClick={() => setIsDatePopoverOpen(true)}
								>
									{task.due_date ? (
										<div className={styles.chip}>
											{convertDateToString(task.due_date)}
											{dateStatus && (
												<div
													className={clsx(
														styles.badge,
														dateStatus.style,
													)}
												>
													{dateStatus.label}
												</div>
											)}

											<DownIcon />
										</div>
									) : (
										<div className={styles.chip}>
											<PlusIcon />
											Añadir fecha límite
										</div>
									)}
								</ButtonBase>
								{isDatePopoverOpen && (
									<Popover
										onClose={() =>
											setIsDatePopoverOpen(false)
										}
										className={clsx(
											styles.popover,
											styles.datePopover,
										)}
										bottomClass={styles.popoverLeft}
									>
										<DateForm
											initialDateTime={task.due_date}
											onSave={handleDateUpdate}
											onRemove={handleDateDelete}
											onClose={() =>
												setIsDatePopoverOpen(false)
											}
											className={styles.form}
										/>
									</Popover>
								)}
							</div>
						</div>
					</section>

					<section
						className={clsx(
							styles.section,
							styles.sectionGrid,
						)}
					>
						<DescriptionIcon
							className={styles.descriptionIcon}
						/>
						<Heading
							level={5}
							className={styles.descriptionHeading}
						>
							Descripción
						</Heading>

						<span />

						<EditableText
							className={styles.editableDescription}
							inputName={`Task description input ${task.id}`}
							onSave={handleDescriptionChange}
							multiline={true}
							maxInputLength={255}
							placeholder={
								"Añade una descripción más detallada..."
							}
						>
							{task.text}
						</EditableText>
					</section>
				</div>
			</div>
		</Modal>
	);
};
