import { CommandOption, OptionType } from 'ts-commands';

export const stepsOption: CommandOption = {
	key: 'steps',
	type: OptionType.number,
	default: -1,
};
