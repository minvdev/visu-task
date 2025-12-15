import styles from "./Image.module.css";

export const Image = ({ src, alt = "", className }) => {
	const img = (
		<img
			src={src}
			alt={alt}
			className={`${styles.image} ${
				className ? styles[className] : ""
			}`}
		/>
	);

	return img;
};
