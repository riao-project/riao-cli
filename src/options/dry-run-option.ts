import { CommandOptions, OptionType } from 'ts-commands';

export const dryRunOption: CommandOptions = {
	key: 'dry-run',
	type: OptionType.boolean,
	default: false,
};
