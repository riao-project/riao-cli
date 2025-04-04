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

export class SeedCreateCommand extends Command {
	override key = 'seed:create';
	override description = 'Create a new seed file';

	override positional = [nameOption];

	override options = [databaseOption];

	override async handle(args: Args) {
		const { fileName, className } = nameClassAndFile(args.name);

		const file = [
			'import { Seed } from \'@riao/dbal/seed\';',
			'',
			`export default class ${className} extends Seed {`,
			'\toverride async up(): Promise<void> {',
			'\t}',
			'',
			'\toverride async down(): Promise<void> {',
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
