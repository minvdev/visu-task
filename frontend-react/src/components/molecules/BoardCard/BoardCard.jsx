import styles from "./BoardCard.module.css";
import clsx from "clsx";
import { Image } from "../../atoms/Image/Image";
import { Heading } from "../../atoms/Heading/Heading";

export const BoardCard = ({
	src,
	name,
	className,
	...props
}) => {
	return (
		<div
			className={clsx(
				styles.board,
				src ? styles.complexBoard : styles.simpleBoard,
				className
			)}
			{...props}
		>
			{src && (
				<div className={styles.imageContainer}>
					<Image
						src={src}
						variants={[!src && "defaultFilter"]}
						className={clsx(styles.image)}
					/>
				</div>
			)}

			<Heading level={4} className={clsx(styles.title)}>
				{name}
			</Heading>
		</div>
	);
};
