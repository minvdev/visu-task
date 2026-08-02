import { useTaskActions } from "@hooks/useTaskActions";
import { useState } from "react";

import type { TagsProps } from "./Tags";
type Task = TagsProps["task"];

type ActiveView =
	| {
			view: "create-tag" | "select-tag";
			onBack?: () => void;
	  }
	| {
			view: "edit-tag";
			onBack?: () => void;
			tag: Task["tags"][number];
	  };

export const useTags = (task: Task) => {
	const [activeView, setActiveView] =
		useState<ActiveView | null>(null);
	const { attachTag, detachTag } = useTaskActions();

	const handleSuccessCreateTag = async (id: number) => {
		try {
			await attachTag(task.id, id);
			setActiveView({ view: "select-tag" });
		} catch (error) {
			console.error(
				"Error attaching task after creating it",
			);
		}
	};

	const handleAttachTag = (id: number) => {
		attachTag(task.id, id);
	};

	const handleDetachTag = (id: number) => {
		detachTag(task.id, id);
	};

	return {
		activeView,
		setActiveView,
		handleSuccessCreateTag,
		handleAttachTag,
		handleDetachTag,
	};
};
