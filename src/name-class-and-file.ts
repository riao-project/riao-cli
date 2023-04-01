/**
 * Create a class & filename
 *
 * @param name Input name, in either kebab-case or pascal-case
 * @return Returns the file & class name
 */
export function nameClassAndFile(name: string) {
	let kebabCase: string;
	let pascalCase: string;

	if (name.includes('-')) {
		// Kebab case
		kebabCase = name;

		// Pascal case
		pascalCase = name
			// Convert to pascal case
			.replace(/-([a-z])/gi, (g) => g[1].toLocaleUpperCase())
			// Remove any remaining hyphens
			.replace(/-/g, '')
			// Capitalize first letter
			.replace(/^([a-z])/, (g) => g.toLocaleUpperCase());
	}
	else {
		const seperateByDash = (g: string) => g[0] + '-' + g[1];

		// Kebab case
		kebabCase = name
			// Convert to kebab case
			.replace(/([a-z0-9][A-Z0-9])/g, seperateByDash)
			// Fix numbers followed by letters
			.replace(/([0-9][a-zA-Z])/g, seperateByDash)
			// To lowercase
			.toLocaleLowerCase();

		// Pascal case
		pascalCase = name;
	}

	return {
		fileName: `${kebabCase}.ts`,
		className: pascalCase,
	};
}
