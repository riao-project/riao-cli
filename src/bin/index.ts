#! /usr/bin/env node

import { registerCommands } from 'ts-commands';

import { DatabaseCreateCommand } from './database-create-command';
import { MigrationCreateCommand } from './migration-create-command';
import { MigrationRunCommand } from './migration-run-command';
import { SchemaBuildCommand } from './schema-build-command';
import { SeedCreateCommand } from './seed-create-command';
import { SeedRunCommand } from './seed-run-command';

registerCommands({
	name: 'riao-cli',
	commands: [
		DatabaseCreateCommand,
		MigrationCreateCommand,
		MigrationRunCommand,
		SchemaBuildCommand,
		SeedCreateCommand,
		SeedRunCommand,
	],
	forceExit: true,
});
