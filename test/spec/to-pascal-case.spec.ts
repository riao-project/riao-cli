import 'jasmine';
import { toPascalCase } from '../../src/utils/string-utils/to-pascal-case';

describe('toPascalCase()', () => {
	it('can convert from kebab-case', () => {
		expect(toPascalCase('my-table-name')).toEqual('MyTableName');
	});

	it('can convert from snake_case', () => {
		expect(toPascalCase('my_table_name')).toEqual('MyTableName');
	});

	it('can convert from camelCase', () => {
		expect(toPascalCase('myTableName')).toEqual('MyTableName');
	});

	it('leaves PascalCase unchanged', () => {
		expect(toPascalCase('MyTableName')).toEqual('MyTableName');
	});

	it('handles mixed separators and multiple consecutive separators', () => {
		expect(toPascalCase('my-_table--name__')).toEqual('MyTableName');
	});
});
