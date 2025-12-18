import styles from "./IconWrapper.module.css";
import clsx from "clsx";
import { Image } from "../../atoms/Image/Image";

export const IconWrapper = ({
	src,
	children,
	variants = [],
	className,
	...props
}) => {
	return (
		<div
			className={clsx(
				styles.wrapper,
				variants.map((variant) => styles[variant]),
				className
			)}
		>
			<Image
				src={src}
				{...props}
				variants={["defaultFilter"]}
			/>
			{children}
		</div>
	);
};
