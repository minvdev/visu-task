import styles from "./IconWrapper.module.css";
import { Image } from "../../atoms/Image/Image";

export const IconWrapper = ({
	src,
	children,
	className,
	...props
}) => {
	return (
		<div
			className={`${styles.wrapper} ${
				className ? styles[className] : ""
			}`}
		>
			<Image src={src} {...props} />
			{children}
		</div>
	);
};
