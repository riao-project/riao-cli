import { Command, ParsedArguments } from 'ts-commands';
import { SeedRunner } from '@riao/dbal/seed';
import { loadDatabase } from '@riao/dbal/database';
import {
	databaseOption,
	directionOption,
	seedOption,
	stepsOption,
} from '../options';

interface Args extends ParsedArguments {
	database: string;
	direction: 'up' | 'down';
	seed: string;
	steps: number;
}

export class SeedRunCommand extends Command {
	override key = 'seed:run';
	override description = 'Run seeds';

	override positional = [];

	override options = [
		databaseOption,
		directionOption,
		seedOption,
		stepsOption
	];

	override async handle(args: Args) {
		const db = await loadDatabase(undefined, args.database);
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
