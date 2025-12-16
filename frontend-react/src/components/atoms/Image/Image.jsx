import styles from "./Image.module.css";
import clsx from "clsx";

export const Image = ({
	src,
	alt = "",
	variants = [],
	className,
}) => {
	const img = (
		<img
			src={src}
			alt={alt}
			className={clsx(
				styles.image,
				variants.map((variant) => styles[variant]),
				className
			)}
		/>
	);

	return img;
};
