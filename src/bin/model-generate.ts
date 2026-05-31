/* eslint-disable no-console */

import * as fs from 'fs';
import * as path from 'path';
import { tsimport } from 'ts-import-ts';
import {
	Command,
	ParsedArguments,
	CommandOption,
	OptionType,
} from 'ts-commands';
import { Database, loadDatabase } from '@riao/dbal/database';
import {
	AddColumnsOptions,
	ColumnOptions,
	DataDefinitionBuilder,
	DataDefinitionRepository,
	CreateTableOptions,
	DropTableOptions,
	DropColumnOptions,
	ColumnType,
	Migration,
	MigrationPackage,
} from '@riao/dbal';
import { databaseOption } from '../options';
import { toPascalCase } from '../utils/string-utils/to-pascal-case';

const outOption: CommandOption = {
	key: 'out',
	type: OptionType.string,
	description: 'Output directory for generated types',
	default: './src/models',
};

const moduleDepthOption: CommandOption = {
	key: 'moduleDepth',
	type: OptionType.number,
	description: 'Number of parts in the table name to use as module path',
	default: 1,
};

const queryRepositoryOption: CommandOption = {
	key: 'queryRepository',
	type: OptionType.string,
	description: 'Path to output query repository files (optional)',
};

const typeMap: Record<ColumnType, string> = {
	[ColumnType.TINYINT]: 'number',
	[ColumnType.SMALLINT]: 'number',
	[ColumnType.INT]: 'number',
	[ColumnType.BIGINT]: 'BigInt',
	[ColumnType.FLOAT]: 'number',
	[ColumnType.DOUBLE]: 'number',
	[ColumnType.DECIMAL]: 'number',
	[ColumnType.BOOL]: 'boolean',
	[ColumnType.DATE]: 'Date',
	[ColumnType.TIMESTAMP]: 'Date',
	[ColumnType.TIME]: 'string',
	[ColumnType.BLOB]: 'Buffer',
	[ColumnType.CHAR]: 'string',
	[ColumnType.VARCHAR]: 'string',
	[ColumnType.TEXT]: 'string',
	[ColumnType.UUID]: 'string',
};

class MockDataDefinitionRepository extends DataDefinitionRepository {
	public tables: Record<string, ColumnOptions[]> = {};

	constructor(ddlBuilderType: typeof DataDefinitionBuilder) {
		super({
			ddlBuilderType,
		});
	}

	override async createTable(options: CreateTableOptions): Promise<void> {
		this.tables[options.name] = options.columns;
	}

	override async dropTable(options: DropTableOptions): Promise<void> {
		if (Array.isArray(options.tables)) {
			for (const table of options.tables) {
				delete this.tables[
					typeof table === 'string'
						? table
						: (table as { name: string }).name
				];
			}
		}
	}

	override async addColumns(options: AddColumnsOptions): Promise<void> {
		if (!this.tables[options.table]) {
			this.tables[options.table] = [];
		}

		this.tables[options.table].push(...options.columns);
	}

	override async dropColumn(options: DropColumnOptions): Promise<void> {
		if (!this.tables[options.table]) {
			throw new Error(`Table ${options.table} does not exist`);
		}

		this.tables[options.table] = this.tables[options.table].filter(
			(col) => col.name !== options.column
		);
	}
}

interface Args extends ParsedArguments {
	database: string;
	out: string;
	moduleDepth: number;
	queryRepository: null | string;
}

export class ModelGenerateCommand extends Command {
	override key = 'model:generate';
	override description = 'Generate typescript models from migrations';

	override positional = [];
	override options = [
		databaseOption,
		outOption,
		moduleDepthOption,
		queryRepositoryOption,
	];

	protected outDir!: string;
	protected moduleDepth!: number;
	protected queryRepository: string | null = null;

	override async handle(args: Args) {
		this.outDir = path.resolve(process.cwd(), args.out);
		fs.mkdirSync(this.outDir, { recursive: true });

		this.queryRepository = args.queryRepository;
		this.moduleDepth = args.moduleDepth;

		const realDb = await loadDatabase(undefined, args.database);

		const mockDdl = new MockDataDefinitionRepository(DataDefinitionBuilder);

		realDb.ddl = mockDdl;
		realDb.getDataDefinitionRepository = () => mockDdl;

		const migrationsDir = path.resolve(
			process.cwd(),
			realDb.getMigrationsDirectory()
		);

		console.log('Processing migrations in:', migrationsDir);

		if (fs.existsSync(migrationsDir)) {
			const migrationsInPath = fs
				.readdirSync(migrationsDir)
				.filter((fname) => /\.ts$/.test(fname));

			await this.traverseMigrations({
				migrations: migrationsInPath,
				migrationsDir: realDb.getMigrationsDirectory(),
				db: realDb,
			});
		}

		for (const [tableName, columns] of Object.entries(mockDdl.tables)) {
			console.log(`Generating types for table: ${tableName}`);
			const interfaceName = toPascalCase(`${tableName}Record`);
			const interfaceFilePath = this.getInterfaceFilePath(tableName);

			let interfaceFileContents = this.generateInterface({
				interfaceName,
				tableName,
				columns,
			});

			if (this.queryRepository === 'inline') {
				interfaceFileContents +=
					'\n' +
					this.generateQueryRepository({
						interfaceName,
						tableName,
						columns,
						db: realDb,
					});
			}
			else if (this.queryRepository) {
				const interfaceRelativeDir = path.dirname(
					path.relative(this.outDir, interfaceFilePath)
				);
				const interfaceFilename = path.basename(
					interfaceFilePath,
					'.ts'
				);
				const repoFilename = `${interfaceFilename}-repository.ts`;
				const repoFilepath = path.join(
					this.queryRepository,
					interfaceRelativeDir,
					repoFilename
				);

				let interfaceImportPath = path
					.relative(path.dirname(repoFilepath), interfaceFilePath)
					.replace(/\\/g, '/')
					.replace(/\.ts$/, '');

				if (!interfaceImportPath.startsWith('.')) {
					interfaceImportPath = `./${interfaceImportPath}`;
				}

				const repoContent =
					`import { ${interfaceName} } from ` +
					`'${interfaceImportPath}';\n\n` +
					this.generateQueryRepository({
						interfaceName,
						tableName,
						columns,
						db: realDb,
					});

				this.saveTypesToFile(repoContent, repoFilepath);
			}

			this.saveTypesToFile(interfaceFileContents, interfaceFilePath);
		}

		this.generateIndexFiles(this.outDir);

		if (this.queryRepository && this.queryRepository !== 'inline') {
			this.generateIndexFiles(this.queryRepository);
		}

		console.log('Types generated successfully.');
	}

	protected async traverseMigrations(options: {
		migrations: string[];
		migrationsDir: string;
		db: Database;
	}): Promise<void> {
		for (const filename of options.migrations) {
			const fullPath = path.join(options.migrationsDir, filename);
			console.log('Loading migration:', fullPath);

			const migrationType = tsimport<typeof Migration>(fullPath);
			const migration = new migrationType(options.db) as
				| Migration
				| MigrationPackage;

			if ('package' in migration) {
				const migs = await migration.getMigrations();

				for (const [name, mig] of Object.entries(migs)) {
					console.log(`Loading migration from package: ${name}`);

					if (mig instanceof Migration) {
						await mig.up();
					}
					else {
						const instance = new mig(options.db, {}) as Migration;
						await instance.up();
					}
				}
			}
			else if ('up' in migration) {
				await migration.up();
			}
			else {
				console.log('Invalid migration export:', migration);
				throw new Error(
					`Invalid migration export in file: ${fullPath}`
				);
			}
		}
	}

	protected generateProperty(options: ColumnOptions): string {
		const tsType = typeMap[options.type] || 'any';
		return `\t${options.name}${options.required ? '' : '?'}: ${tsType};`;
	}

	protected generateInterface(options: {
		interfaceName: string;
		tableName: string;
		columns: ColumnOptions[];
	}): string {
		const properties = options.columns
			.map((col) => this.generateProperty(col))
			.join('\n');

		return (
			`export interface ${options.interfaceName} ` +
			`{\n${properties}\n}\n`
		);
	}

	protected generateQueryRepository(options: {
		interfaceName: string;
		tableName: string;
		columns: ColumnOptions[];
		db: Database;
	}): string {
		const className = toPascalCase(`${options.tableName}Repository`);
		const idColumn = options.columns.find((col) => col.primaryKey);
		const dbVar = options.db.name + 'db';

		return (
			`import { ${dbVar} } from ` +
			`'@/database/${options.db.name}';` +
			'\n\n' +
			`export const ${className} = ` +
			`${dbVar}.getQueryRepository<${options.interfaceName}>` +
			'({\n' +
			`\ttable: '${options.tableName}',\n` +
			`\tidentifiedBy: '${idColumn?.name}'\n` +
			'});\n'
		);
	}

	protected getInterfaceFilePath(tableName: string): string {
		const parts = tableName.split('_');

		const splitIndex = Math.min(
			this.moduleDepth,
			Math.max(0, parts.length - 1)
		);

		const moduleParts = parts.slice(0, splitIndex);
		const fileParts = parts.slice(splitIndex);

		if (fileParts.length === 0) {
			fileParts.push(moduleParts.pop() || 'index');
		}

		const fileName = `${fileParts.join('-')}.ts`;
		return path.join(this.outDir, ...moduleParts, fileName);
	}

	protected saveTypesToFile(types: string, filePath: string): void {
		const dirPath = path.dirname(filePath);

		fs.mkdirSync(dirPath, { recursive: true });

		fs.writeFileSync(filePath, types, 'utf-8');
		console.log(`Types saved to ${filePath}`);
	}

	protected generateIndexFiles(dir: string): void {
		if (!fs.existsSync(dir)) {
			return;
		}

		const files = fs.readdirSync(dir);
		const exports: string[] = [];

		for (const file of files) {
			const fullPath = path.join(dir, file);
			if (fs.statSync(fullPath).isDirectory()) {
				this.generateIndexFiles(fullPath);
				exports.push(`export * from './${file}';`);
			}
			else if (file.endsWith('.ts') && file !== 'index.ts') {
				const fileNameNoExt = file.replace(/\.ts$/, '');
				exports.push(`export * from './${fileNameNoExt}';`);
			}
		}

		if (exports.length > 0) {
			fs.writeFileSync(
				path.join(dir, 'index.ts'),
				exports.join('\n') + '\n',
				'utf-8'
			);
		}
	}
}
