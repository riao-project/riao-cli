import { Command, ParsedArguments } from 'ts-commands';
import { MigrationRunner } from '@riao/dbal/migration';
import { loadDatabase } from '@riao/dbal/database';
import {
	databaseOption,
	directionOption,
	dryRunOption,
	stepsOption,
} from '../options';
import * as fs from 'fs';
import * as path from 'path';

interface Args extends ParsedArguments {
	database: string;
	direction: 'up' | 'down';
	steps: number;
	'dry-run': boolean;
}

export class MigrationRunCommand extends Command {
	override key = 'migration:run';
	override description = 'Run migrations';

	override positional = [];

	override options = [databaseOption, directionOption, dryRunOption, stepsOption];

	override async handle(args: Args) {
		const db = await loadDatabase(undefined, args.database);

		if (args['dry-run']) {
			const migrationsDir = db.getMigrationsDirectory();
			const direction = args.direction ?? 'up';
			const steps = args.steps > 0 ? args.steps : undefined;

			const migrationFiles: string[] = fs
				.readdirSync(migrationsDir)
				.filter((filename) => /\.ts$/.test(filename))
				.map((filename) =>
					path
						.basename(filename.toLowerCase(), path.extname(filename))
				)
				.sort();

			let alreadyRanNames: string[] = [];

			const schemaRepo = db.getSchemaQueryRepository();
			const tables = await schemaRepo.getTables();
			const migrationTableExists = tables.some(
				(table) => table.name === 'riao_migration'
			);

			if (migrationTableExists) {
				const repo = db.getQueryRepository();
				const alreadyRan = await repo.find({
					columns: ['name'],
					table: 'riao_migration',
				});
				alreadyRanNames = alreadyRan.map(
					(record) => record['name'] as string
				);
			}
			else {
				// eslint-disable-next-line no-console
				console.log('[Dry Run] No migrations have been run yet.');
			}

			let pendingMigrations: string[];

			if (direction === 'up') {
				pendingMigrations = migrationFiles.filter(
					(name) => !alreadyRanNames.includes(name)
				);
			}
			else {
				pendingMigrations = [...alreadyRanNames].reverse();
			}

			if (steps !== undefined) {
				pendingMigrations = pendingMigrations.slice(0, steps);
			}

			// eslint-disable-next-line no-console
			console.log('[Dry Run] Migrations that would run:');

			if (pendingMigrations.length === 0) {
				// eslint-disable-next-line no-console
				console.log('  (none)');
			}
			else {
				for (const name of pendingMigrations) {
					// eslint-disable-next-line no-console
					console.log(`  ${direction.toUpperCase()} | ${name}`);
				}
			}

			return;
		}

		const runner = new MigrationRunner(db);

		await runner.run(undefined, undefined, args.direction, args.steps);
	}
}
