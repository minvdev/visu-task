/**
 * Converts a string to a URL-safe slug
 * @param {string} str - The string to convert
 * @returns {string} - URL-safe slug
 */
export const slugify = (str) => {
	return str
		.toString()
		.normalize("NFD") // Normalize accented characters
		.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/[^\w-]+/g, "") // Remove non-word characters (except hyphens)
		.replace(/--+/g, "-") // Replace multiple hyphens with single
		.replace(/^-+/, "") // Remove leading hyphens
		.replace(/-+$/, ""); // Remove trailing hyphens
};
