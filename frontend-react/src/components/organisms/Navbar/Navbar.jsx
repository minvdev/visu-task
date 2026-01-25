import { Heading } from "../../atoms/Heading/Heading";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";
import styles from "./Navbar.module.css";
import clsx from "clsx";
import { SearchIcon } from "../../../assets/icons/SearchIcon/SearchIcon";
import { UserIcon } from "../../../assets/icons/UserIcon/UserIcon";

export const Navbar = () => {
	const { logout, user } = useAuth();
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const displayName = user?.username || "Usuario";

	return (
		<nav className={styles.navbar}>
			<div className={styles.logo}>
				<Heading level={3}>VisuTask</Heading>
			</div>

			<div
				className={clsx(styles.searchBar, styles.wrapper)}
			>
				<SearchIcon />
				<Input
					placeholder="Buscar"
					variants={["input-sm"]}
					value={searchQuery}
					onChange={handleSearchChange}
				/>
			</div>

			<div className={clsx(styles.actions, styles.wrapper)}>
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
