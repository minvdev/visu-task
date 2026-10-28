import { useMemo } from "react";
import { useColumnActions } from "@hooks/useColumnActions";

import {
	MenuPopover,
	MenuPopoverProps,
} from "@organisms/MenuPopover/MenuPopover";
type Options = MenuPopoverProps["options"];

export interface MenuProps {
	onSelectCreateTask: () => void;
}

export const Menu = ({ onSelectCreateTask }: MenuProps) => {
	const { deleteColumn } = useColumnActions();

	const options = useMemo<Options>(
		() => [
			{
				options: [
					{
						text: "Añadir tarjeta",
						action: onSelectCreateTask,
						closeOnSelect: true,
					},
				],
			},
			{
				options: [
					{
						text: "Eliminar esta lista",
						action: () => deleteColumn(),
					},
				],
			},
		],
		[],
	);

	return <MenuPopover title="Acciones" options={options} />;
};
