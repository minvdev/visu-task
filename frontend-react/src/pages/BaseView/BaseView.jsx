import styles from "./BaseView.module.css";
import { Heading } from "../../components/atoms/Heading/Heading";

function BaseView({ children }) {
	return (
		<div className={styles.container}>
			<Heading variant="primary">VisuTask</Heading>
			{children}
		</div>
	);
}

export default BaseView;
