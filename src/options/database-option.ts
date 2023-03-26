import { CommandOptions, OptionType } from 'ts-commands';

export const databaseOption: CommandOptions = {
	key: 'database',
	type: OptionType.string,
	default: 'main',
};
