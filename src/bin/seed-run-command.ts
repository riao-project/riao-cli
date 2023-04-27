import { Command, OptionType } from 'ts-commands';
import { SeedRunner } from 'riao-dbal/src/seed';
import { loadDatabase } from 'riao-dbal/src/database';
import {
	databaseOption,
	directionOption,
	seedOption,
	stepsOption,
} from '../options';

interface Args {
	database: string;
	direction: 'up' | 'down';
	seed: string;
	steps: number;
}

export class SeedRunCommand extends Command {
	signature = 'seed:run';
	description = 'Run seeds';

	positional = [];

	options = [databaseOption, directionOption, seedOption, stepsOption];

	async handle(args: Args) {
		const db = await loadDatabase(null, args.database);
		const runner = new SeedRunner(db);

		await runner.run(
			undefined,
			undefined,
			args.direction,
			args.steps,
			args.seed
				? args.seed.includes('.ts')
					? args.seed
					: args.seed + '.ts'
				: undefined
		);
	}
}
