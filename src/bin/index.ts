#! /usr/bin/env node

import { registerCommands } from 'ts-commands';

import { MigrationCreateCommand } from './migration-create-command';
import { MigrationRunCommand } from './migration-run-command';
import { SeedCreateCommand } from './seed-create-command';
import { SeedRunCommand } from './seed-run-command';

registerCommands({
	name: 'riao-cli',
	commands: [
		MigrationCreateCommand,
		MigrationRunCommand,
		SeedCreateCommand,
		SeedRunCommand,
	],
	forceExit: true,
});
