import { Command, OptionType } from 'ts-commands';
import { MigrationRunner } from 'riao-dbal/src/migration';
import { loadDatabase } from 'riao-dbal/src/database';
import { databaseOption } from 'src/options';

interface Args {
	database: string;
}

export class MigrationRunCommand extends Command {
	signature = 'migration:run';
	description = 'Run migrations';

	positional = [];

	options = [databaseOption];

	async handle(args: Args) {
		const db = await loadDatabase(null, args.database);
		const runner = new MigrationRunner(db);

		await runner.run();
	}
}
