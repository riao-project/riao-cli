import { CommandOptions, OptionType } from 'ts-commands';

export const directionOption: CommandOptions = {
	key: 'direction',
	type: OptionType.string,
	default: 'up',
	choices: ['up', 'down'],
};
