import { useState, useCallback, useMemo } from "react";
import { useColumnActions } from "@hooks/useColumnActions";

import { MenuPopover } from "@organisms/MenuPopover/MenuPopover";

import type { Options } from "@components/molecules/OptionsMenu/OptionsMenu";
import type { components } from "@/types/open-api-schema";
type TaskSubschema = components["schemas"]["CardSubschema"];

export interface MenuProps {
	task: TaskSubschema;
}

export const Menu = ({ task }: MenuProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const { deleteTask } = useColumnActions();

	const handleTaskDelete = useCallback(async () => {
		try {
			setIsLoading(true);
			await deleteTask(task.id);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const options = useMemo<Options>(
		() => [
			{
				options: [
					{
						text: "Eliminar tarea",
						action: handleTaskDelete,
						disabled: isLoading,
					},
				],
			},
		],
		[isLoading],
	);

	return <MenuPopover options={options} />;
};
