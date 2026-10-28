import styles from "./FullPageLoader.module.css";

export const FullPageLoader = () => {
	return (
		<div className={styles["container"]}>
			<div className={styles["spinner"]} />
		</div>
	);
};
