import { CommandOptions, OptionType } from 'ts-commands';

export const nameOption: CommandOptions = {
	key: 'name',
	type: OptionType.string,
};
