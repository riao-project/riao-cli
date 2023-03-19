#! /usr/bin/env node

import { registerCommands } from 'ts-commands';

import { MigrationCreateCommand } from './migration-create-command';

registerCommands({
	name: 'riao-cli',
	commands: [MigrationCreateCommand],
});
