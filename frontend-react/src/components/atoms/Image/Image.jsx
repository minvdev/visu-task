import styles from "./Image.module.css";

export const Image = ({
	src,
	alt = "",
	href,
	className,
}) => {
	const img = (
		<img src={src} alt={alt} className={styles.image} />
	);

	if (href) {
		return (
			<a className={className} href={href}>
				{img}
			</a>
		);
	}
	return img;
};
