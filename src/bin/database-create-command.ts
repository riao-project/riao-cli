import { join as joinPath } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { getDatabasePath, loadDatabase } from '@riao/dbal/database';
import { databaseOption, nameOption } from '../options';
import { Command, ParsedArguments } from 'ts-commands';
import { nameClassAndFile } from '../name-class-and-file';
import { DbDrivers, dbDriverProperties, dbDriverOption } from '../options';
import { execSync } from 'child_process';

interface Args extends ParsedArguments {
	name: string;
	driver: DbDrivers;
}

export class DatabaseCreateCommand extends Command {
	override key = 'db:create';
	override description = 'Create a new database';

	override positional = [{ ...nameOption, default: 'main' }];

	override options = [dbDriverOption];

	override async handle(args: Args) {
		let { fileName, className } = nameClassAndFile(args.name);
		const folderName = fileName.replace('.ts', '');
		const constName =
			className.replace(/(?:^|\s)\S/, (a) => a.toLowerCase()) + 'db';

		className += 'Database';

		const rootDir = getDatabasePath();
		const databaseDir = joinPath(rootDir, folderName);
		const migrationsDir = joinPath(databaseDir, 'migrations');
		const seedsDir = joinPath(databaseDir, 'seeds');

		const dbTypeProperties = dbDriverProperties[args.driver];
		const baseClassName = dbTypeProperties.className;
		const baseClassPackage = dbTypeProperties.package;

		if (existsSync(databaseDir)) {
			throw new Error('Database ' + folderName + ' already exists!');
		}

		mkdirSync(databaseDir, { recursive: true });

		// Create index file
		const indexFilePath = joinPath(databaseDir, 'index.ts');
		const indexFile = [
			`import { ${baseClassName} } from \'${baseClassPackage}\';`,
			'',
			`export default class ${className} extends ${baseClassName} {`,
			`\toverride name = '${folderName}';`,
			'}',
			'',
			`export const ${constName} = new ${className}();`,
			'',
		];

		writeFileSync(indexFilePath, indexFile.join('\n'));

		// Create .env example
		const envFileName = folderName + '.db.env';
		const envFilePath = joinPath(databaseDir, envFileName);

		const envFile = [
			'host="localhost"',
			`port=${dbTypeProperties.port}`,
			'username=""',
			'password=""',
			'database=""',
		];

		writeFileSync(envFilePath, envFile.join('\n'));
		writeFileSync(envFilePath + '.example', envFile.join('\n'));

		// Create migrations dir
		mkdirSync(migrationsDir, { recursive: true });
		writeFileSync(joinPath(migrationsDir, '.gitignore'), '');

		// Create seeds dir
		mkdirSync(seedsDir, { recursive: true });
		writeFileSync(joinPath(seedsDir, '.gitignore'), '');

		// Install database
		execSync('npm i ' + baseClassPackage);
	}
}
