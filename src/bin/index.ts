#! /usr/bin/env node

import { registerCommands } from 'ts-commands';

import { MigrationCreateCommand } from './migration-create-command';
import { MigrationRunCommand } from './migration-run-command';

registerCommands({
	name: 'riao-cli',
	commands: [MigrationCreateCommand, MigrationRunCommand],
	forceExit: true,
});
