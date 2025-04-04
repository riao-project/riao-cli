import { join as joinPath } from 'path';
import { writeFileSync } from 'fs';
import { getDatabasePath, loadDatabase } from '@riao/dbal/database';
import { databaseOption, nameOption } from '../options';
import { Command, ParsedArguments } from 'ts-commands';
import { nameClassAndFile } from '../name-class-and-file';

interface Args extends ParsedArguments {
	name: string;
	database: string;
}

export class MigrationCreateCommand extends Command {
	override key = 'migration:create';
	override description = 'Create a new migration file';

	override positional = [nameOption];

	override options = [databaseOption];

	override async handle(args: Args) {
		const { fileName, className } = nameClassAndFile(args.name);

		const file = [
			'import { Migration } from \'@riao/dbal\';',
			'',
			`export default class ${className} extends Migration {`,
			'\toverride async up() {',
			'\t\t',
			'\t}',
			'',
			'\toverride async down() {',
			'\t\t',
			'\t}',
			'}',
			'',
		];

		const databaseDir = getDatabasePath();
		const db = await loadDatabase(databaseDir, args.database);

		const path = joinPath(
			db.getMigrationsDirectory(),
			`${Date.now()}-${fileName}`
		);

		writeFileSync(path, file.join('\n'));
	}
}
