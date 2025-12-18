import { Heading } from "../../atoms/Heading/Heading";
import { IconWrapper } from "../../molecules/IconWrapper/IconWrapper";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";
import styles from "./Navbar.module.css";
import searchIcon from "../../../assets/icons/search.svg";
import userIcon from "../../../assets/icons/user.svg";

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

			<div className={styles.searchBar}>
				<IconWrapper src={searchIcon}>
					<Input
						placeholder="Buscar"
						variants={["input-sm"]}
						value={searchQuery}
						onChange={handleSearchChange}
					/>
				</IconWrapper>
			</div>

			<div className={styles.actions}>
				<IconWrapper
					src={userIcon}
					alt="User avatar"
					variants={["no-border"]}
				>
					<p>{displayName}</p>
				</IconWrapper>

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
