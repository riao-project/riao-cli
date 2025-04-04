import { CommandOption, OptionType } from 'ts-commands';

interface DbDriverPropertiesInterface {
	package: string;
	className: string;
	port?: number;
}

export const dbDriverProperties: {
	[key: string]: DbDriverPropertiesInterface;
} = {
	mssql2017: {
		package: '@riao/mssql',
		className: 'DatabaseMsSql2017',
		port: 1433,
	},
	mssql2019: {
		package: '@riao/mssql',
		className: 'DatabaseMsSql2019',
		port: 1433,
	},
	mysql5: {
		package: '@riao/mysql',
		className: 'DatabaseMySql5',
		port: 3306,
	},
	mysql8: {
		package: '@riao/mysql',
		className: 'DatabaseMySql8',
		port: 3306,
	},
	pg12: {
		package: '@riao/postgres',
		className: 'DatabasePostgres12',
		port: 5432,
	},
	pg13: {
		package: '@riao/postgres',
		className: 'DatabasePostgres13',
		port: 5432,
	},
	pg14: {
		package: '@riao/postgres',
		className: 'DatabasePostgres14',
		port: 5432,
	},
	pg15: {
		package: '@riao/postgres',
		className: 'DatabasePostgres15',
		port: 5432,
	},
	sqlite: {
		package: '@riao/sqlite',
		className: 'DatabaseSqlite',
	},
};

export type DbDrivers = keyof typeof dbDriverProperties;
export const dbDriverKeys = Object.keys(dbDriverProperties);

export const dbDriverOption: CommandOption = {
	key: 'driver',
	type: OptionType.string,
	default: 'mysql8',
	choices: dbDriverKeys,
};
