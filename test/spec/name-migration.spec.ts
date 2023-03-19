import 'jasmine';
import { nameMigration } from '../../src/name-migration';

describe('nameMigration()', () => {
	it('can convert from camel-case', () => {
		const { fileName, className } = nameMigration('kebab-case');

		expect(fileName).toMatch(/^[0-9]+\-kebab\-case\.ts$/);
		expect(className).toEqual('KebabCase');
	});

	it('can convert from camel-case with numbers', () => {
		const { fileName, className } = nameMigration('kebab-1-case-2');

		expect(fileName).toMatch(/^[0-9]+\-kebab\-1\-case\-2\.ts$/);
		expect(className).toEqual('Kebab1Case2');
	});

	it('can convert from pascal-case', () => {
		const { fileName, className } = nameMigration('PascalCase');

		expect(fileName).toMatch(/^[0-9]+\-pascal\-case\.ts$/);
		expect(className).toEqual('PascalCase');
	});

	it('can convert from pascal-case with numbers', () => {
		const { fileName, className } = nameMigration('Pascal1Case2');

		expect(fileName).toMatch(/^[0-9]+\-pascal\-1\-case\-2\.ts$/);
		expect(className).toEqual('Pascal1Case2');
	});
});
