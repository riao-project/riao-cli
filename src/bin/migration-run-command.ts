import { Command, ParsedArguments } from 'ts-commands';
import { MigrationRunner } from '@riao/dbal/migration';
import { loadDatabase } from '@riao/dbal/database';
import { databaseOption, directionOption, stepsOption } from '../options';

interface Args extends ParsedArguments {
	database: string;
	direction: 'up' | 'down';
	steps: number;
}

export class MigrationRunCommand extends Command {
	override key = 'migration:run';
	override description = 'Run migrations';

	override positional = [];

	override options = [databaseOption, directionOption, stepsOption];

	override async handle(args: Args) {
		const db = await loadDatabase(undefined, args.database);
		const runner = new MigrationRunner(db);

		await runner.run(undefined, undefined, args.direction, args.steps);
	}
}
