#! /usr/bin/env ts-node

import { CommandDispatcher } from 'ts-commands';

import { DatabaseCreateCommand } from './database-create-command';
import { MigrationCreateCommand } from './migration-create-command';
import { MigrationRunCommand } from './migration-run-command';
import { SchemaBuildCommand } from './schema-build-command';
import { SeedCreateCommand } from './seed-create-command';
import { SeedRunCommand } from './seed-run-command';

new CommandDispatcher({
	commands: [
		DatabaseCreateCommand,
		MigrationCreateCommand,
		MigrationRunCommand,
		SchemaBuildCommand,
		SeedCreateCommand,
		SeedRunCommand,
	],
}).run();
