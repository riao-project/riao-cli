import { CommandOption, OptionType } from 'ts-commands';

export const databaseOption: CommandOption = {
	key: 'database',
	type: OptionType.string,
	default: 'main',
};
