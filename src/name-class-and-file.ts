import { toPascalCase } from './utils/string-utils/to-pascal-case';

/**
 * Create a class & filename
 *
 * @param name Input name, in either kebab-case or pascal-case
 * @return Returns the file & class name
 */
export function nameClassAndFile(name: string) {
	let kebabCase: string;

	if (name.includes('-')) {
		// Kebab case
		kebabCase = name;
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
	}

	return {
		fileName: `${kebabCase}.ts`,
		className: toPascalCase(name),
	};
}
