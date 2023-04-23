import { CommandOptions, OptionType } from 'ts-commands';

export const stepsOption: CommandOptions = {
	key: 'steps',
	type: OptionType.number,
	default: -1,
};
