export function toPascalCase(name: string): string {
	return name
		.split(/[-_]+/)
		.filter(Boolean)
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join('');
}
