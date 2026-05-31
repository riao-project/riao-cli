import { CommandOption, OptionType } from 'ts-commands';

export const dryRunOption: CommandOption = {
	key: 'dry-run',
	type: OptionType.boolean,
	default: false,
	description: 'Preview which migrations would run without executing them',
};
