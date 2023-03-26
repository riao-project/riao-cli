import { writeFileSync } from 'fs';
import { nameOption } from 'src/options';
import { Command, OptionType } from 'ts-commands';
import { nameMigration } from '../name-migration';

interface Args {
	name: string;
}

export class MigrationCreateCommand extends Command {
	signature = 'migration:create [name]';
	description = 'Create a new migration file';

	positional = [nameOption];

	options = [];

	async handle(args: Args) {
		const { fileName, className } = nameMigration(args.name);

		const file = [
			'import { Migration } from \'riao-dbal\';',
			'',
			`export default class ${className} extends Migration {`,
			'\tasync up() {',
			'\t\t',
			'\t}',
			'',
			'\tasync down() {',
			'\t\t',
			'\t}',
			'}',
			'',
		];

		writeFileSync(fileName, file.join('\n'));
	}
}
