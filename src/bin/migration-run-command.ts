import { Command, OptionType } from 'ts-commands';
import { MigrationRunner } from 'riao-dbal/src/migration';
import { loadDatabase } from 'riao-dbal/src/database';
import { databaseOption, directionOption, stepsOption } from '../options';

interface Args {
	database: string;
	direction: 'up' | 'down';
	steps: number;
}

export class MigrationRunCommand extends Command {
	signature = 'migration:run';
	description = 'Run migrations';

	positional = [];

	options = [databaseOption, directionOption, stepsOption];

	async handle(args: Args) {
		const db = await loadDatabase(null, args.database);
		const runner = new MigrationRunner(db);

		await runner.run(
			undefined,
			undefined,
			args.direction,
			args.steps,
		);
	}
}
