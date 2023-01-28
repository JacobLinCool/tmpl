import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import inquirer from "inquirer";
import type { Ora } from "ora";
import { peek } from "./peek";
import { storage } from "./storage";
import { tree_to_list } from "./utils";
import * as variable from "./variable";

export async function use(
	name: string,
	tag?: string,
	{
		dir = process.cwd(),
		interactive = false,
		overwrite = false,
		variables = {} as Record<string, string>,
		spinner = undefined as Ora | undefined,
	} = {},
): Promise<void> {
	const { files, vars } = await peek(name, tag);

	for (const v in vars) {
		if (variables[v] === undefined) {
			if (interactive) {
				const { value } = await inquirer.prompt({
					type: "input",
					name: "value",
					message: `Variable ${chalk.yellowBright(v)} is not set, please input a value:`,
				});
				variables[v] = value;
			} else {
				throw new Error(`Variable "${v}" is not set`);
			}
		}
	}

	const dests = tree_to_list(files);

	const src_dir = storage.local[name].$path;
	for (let i = 0; i < dests.length; i++) {
		const dest = path.join(dir, dests[i]);
		const src = path.join(src_dir, dests[i]);

		if (fs.existsSync(dest) && !overwrite) {
			if (interactive) {
				const { overwrite } = await inquirer.prompt({
					type: "confirm",
					name: "overwrite",
					message: `File "${dest}" already exists, overwrite?`,
				});
				if (!overwrite) {
					continue;
				}
			} else {
				throw new Error(`File "${dest}" already exists`);
			}
		}

		const parent = path.dirname(dest);
		if (!fs.existsSync(parent)) {
			fs.mkdirSync(parent, { recursive: true });
		}

		fs.copyFileSync(src, dest);
		spinner?.succeed(`Write file ${chalk.greenBright(dests[i])}`);
	}

	variable.replace(dests, variables, { dir });
	spinner?.succeed("All variables replaced");
}
