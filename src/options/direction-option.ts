import { CommandOption, OptionType } from 'ts-commands';

export const directionOption: CommandOption = {
	key: 'direction',
	type: OptionType.string,
	default: 'up',
	choices: ['up', 'down'],
};
