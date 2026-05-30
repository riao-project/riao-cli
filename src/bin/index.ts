#! /usr/bin/env ts-node

import { CommandDispatcher } from 'ts-commands';

import { DatabaseCreateCommand } from './database-create-command';
import { MigrationCreateCommand } from './migration-create-command';
import { MigrationRunCommand } from './migration-run-command';
import { SchemaBuildCommand } from './schema-build-command';
import { SeedCreateCommand } from './seed-create-command';
import { SeedRunCommand } from './seed-run-command';
import { ModelGenerateCommand } from './model-generate';

new CommandDispatcher({
	commands: [
		DatabaseCreateCommand,
		MigrationCreateCommand,
		MigrationRunCommand,
		ModelGenerateCommand,
		SchemaBuildCommand,
		SeedCreateCommand,
		SeedRunCommand,
	],
}).run();
