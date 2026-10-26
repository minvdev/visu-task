import styles from "./Navbar.module.css";
import clsx from "clsx";

import {
	useState,
	type ChangeEvent,
	type CSSProperties,
} from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext/AuthProvider";

import { Heading } from "@atoms/Heading/Heading";
import { Input } from "@atoms/Input/Input";
import { Button } from "@atoms/Button/Button";
import { SearchIcon } from "@assets/icons/SearchIcon/SearchIcon";
import { UserIcon } from "@assets/icons/UserIcon/UserIcon";

import { NAVBAR_HEIGHT } from "@constants/layout";

export const Navbar = () => {
	const { logout, user } = useAuth();
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearchChange = (
		event: ChangeEvent<HTMLInputElement>,
	) => {
		setSearchQuery(event.target.value);
	};

	const displayName = user?.username || "Usuario";

	return (
		<nav
			className={styles["navbar"]}
			style={
				{
					["--navbar-height"]: `${NAVBAR_HEIGHT}px`,
				} as CSSProperties
			}
		>
			<Link to="/dashboard" className={styles["logo"]}>
				<Heading level={3}>VisuTask</Heading>
			</Link>

			<div
				className={clsx(
					styles["searchBar"],
					styles["wrapper"],
				)}
			>
				<SearchIcon />
				<Input
					placeholder="Buscar"
					variants={["input-sm"]}
					value={searchQuery}
					onChange={handleSearchChange}
					name="searchBarInput"
				/>
			</div>

			<div
				className={clsx(
					styles["actions"],
					styles["wrapper"],
				)}
			>
				<UserIcon />
				<span>{displayName}</span>

				<Button
					onClick={logout}
					variants={["danger", "button-sm"]}
				>
					Salir
				</Button>
			</div>
		</nav>
	);
};
