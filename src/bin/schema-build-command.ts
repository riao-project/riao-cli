import { Command } from 'ts-commands';
import { loadDatabase } from 'riao-dbal/src/database';
import { databaseOption } from '../options';

interface Args {
	database: string;
}

export class SchemaBuildCommand extends Command {
	signature = 'schema:build';
	description = 'Run seeds';

	positional = [];

	options = [databaseOption];

	async handle(args: Args) {
		const db = await loadDatabase(null, args.database);
		await db.buildSchema();
	}
}
