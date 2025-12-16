import styles from "./Image.module.css";
import clsx from "clsx";

export const Image = ({ src, alt = "", className }) => {
	const img = (
		<img
			src={src}
			alt={alt}
			className={clsx(styles.image, className)}
		/>
	);

	return img;
};
