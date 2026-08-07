import { type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext/AuthProvider";

import { FullPageLoader } from "@components/atoms/FullPageLoader/FullPageLoader";

export const AppInitializer = ({
	children,
}: {
	children: ReactNode;
}) => {
	const { isLoading } = useAuth();

	if (isLoading) return <FullPageLoader />;

	return children;
};
