import { join as joinPath } from 'path';
import { writeFileSync } from 'fs';
import { getDatabasePath, loadDatabase } from '@riao/dbal/database';
import { databaseOption, nameOption } from '../options';
import { Command, OptionType } from 'ts-commands';
import { nameClassAndFile } from '../name-class-and-file';

interface Args {
	name: string;
	database: string;
}

export class SeedCreateCommand extends Command {
	signature = 'seed:create [name]';
	description = 'Create a new seed file';

	positional = [nameOption];

	options = [databaseOption];

	async handle(args: Args) {
		const { fileName, className } = nameClassAndFile(args.name);

		const file = [
			'import { Seed } from \'@riao/dbal/seed\';',
			'',
			`export default class ${className} extends Seed {`,
			'\tpublic async up(): Promise<void> {',
			'\t}',
			'',
			'\tpublic async down(): Promise<void> {',
			'\t}',
			'}',
			'',
		];

		const databaseDir = getDatabasePath();
		const db = await loadDatabase(databaseDir, args.database);

		const path = joinPath(db.getSeedsDirectory(), fileName);

		writeFileSync(path, file.join('\n'));
	}
}
