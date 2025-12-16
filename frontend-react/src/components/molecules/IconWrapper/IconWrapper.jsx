import styles from "./IconWrapper.module.css";
import clsx from "clsx";
import { Image } from "../../atoms/Image/Image";

export const IconWrapper = ({
	src,
	children,
	className,
	...props
}) => {
	return (
		<div className={clsx(styles.wrapper, className)}>
			<Image src={src} {...props} />
			{children}
		</div>
	);
};
