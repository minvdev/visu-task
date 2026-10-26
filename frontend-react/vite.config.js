import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@components": path.resolve(
				__dirname,
				"./src/components",
			),
			"@atoms": path.resolve(
				__dirname,
				"./src/components/atoms",
			),
			"@molecules": path.resolve(
				__dirname,
				"./src/components/molecules",
			),
			"@organisms": path.resolve(
				__dirname,
				"./src/components/organisms",
			),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@hooks": path.resolve(__dirname, "./src/hooks"),
			"@services": path.resolve(
				__dirname,
				"./src/services",
			),
			"@constants": path.resolve(
				__dirname,
				"./src/constants",
			),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@": path.resolve(__dirname, "./src/"),
		},
	},
});
