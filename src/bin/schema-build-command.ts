import { Command, ParsedArguments } from 'ts-commands';
import { loadDatabase } from '@riao/dbal/database';
import { databaseOption } from '../options';

interface Args extends ParsedArguments {
	database: string;
}

export class SchemaBuildCommand extends Command {
	override key = 'schema:build';
	override description = 'Build schema';

	override positional = [];

	override options = [databaseOption];

	override async handle(args: Args) {
		const db = await loadDatabase(undefined, args.database);
		await db.buildSchema();
	}
}
