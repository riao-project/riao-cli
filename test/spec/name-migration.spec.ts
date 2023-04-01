import 'jasmine';
import { nameClassAndFile } from '../../src/name-class-and-file';

describe('nameMigration()', () => {
	it('can convert from camel-case', () => {
		const { fileName, className } = nameClassAndFile('kebab-case');

		expect(fileName).toMatch(/^kebab\-case\.ts$/);
		expect(className).toEqual('KebabCase');
	});

	it('can convert from camel-case with numbers', () => {
		const { fileName, className } = nameClassAndFile('kebab-1-case-2');

		expect(fileName).toMatch(/^kebab\-1\-case\-2\.ts$/);
		expect(className).toEqual('Kebab1Case2');
	});

	it('can convert from pascal-case', () => {
		const { fileName, className } = nameClassAndFile('PascalCase');

		expect(fileName).toMatch(/^pascal\-case\.ts$/);
		expect(className).toEqual('PascalCase');
	});

	it('can convert from pascal-case with numbers', () => {
		const { fileName, className } = nameClassAndFile('Pascal1Case2');

		expect(fileName).toMatch(/^pascal\-1\-case\-2\.ts$/);
		expect(className).toEqual('Pascal1Case2');
	});
});
