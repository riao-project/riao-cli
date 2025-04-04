import { CommandOption, OptionType } from 'ts-commands';

export const nameOption: CommandOption = {
	key: 'name',
	type: OptionType.string,
};
