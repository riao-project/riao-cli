import { CommandOption, OptionType } from 'ts-commands';

export const dryRunOption: CommandOption = {
	key: 'dry-run',
	type: OptionType.boolean,
	default: false,
	description: 'Preview which steps would run without executing them',
};
