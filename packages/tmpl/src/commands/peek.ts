import path from "node:path";
import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import { list } from "@/list";
import { peek } from "@/peek";
import type { Dir } from "@/peek";
import { fatal } from "@/utils";
import * as validation from "@/validation";

export const command = new Command("peek")
	.description("peek the files and variables of a template")
	.argument("[name]", "template name", "")
	.argument("[tag]", "template tag", "")
	.action(async (name: string, tag: string) => {
		if (!name || validation.name(name) !== true) {
			const { name: n } = await inquirer.prompt([
				{
					type: "list",
					name: "name",
					message: "Template name",
					choices: Object.keys(await list()),
					validate: validation.name,
				},
			]);
			name = n;
		}

		if (tag && validation.tag(tag) !== true) {
			const { tag: t } = await inquirer.prompt([
				{
					type: "input",
					name: "tag",
					message: "Template tag",
					default: tag,
					validate: validation.tag,
				},
			]);
			tag = t;
		}

		const spinner = ora(`Peeking template ${name}`).start();
		const result = await peek(name, tag).catch((err) =>
			fatal<{
				files: Dir;
				vars: Record<string, string[]>;
			}>(err, spinner.fail.bind(spinner)),
		);
		spinner.stop();

		function dir(obj: object, level = 1) {
			const prefix = " ".repeat(level * 4);
			const files: string[] = [];
			for (const [key, value] of Object.entries(obj)) {
				if (value === true) {
					files.push(key);
				} else {
					console.log(prefix + chalk.yellowBright.bold(`${key}${path.sep}`));
					dir(value, level + 1);
				}
			}
			files.forEach((file) => console.log(prefix + file));
		}

		console.log(chalk.bold("Files:"));
		dir(result.files);

		console.log();
		console.log(
			chalk.bold("Variables:"),
			Object.keys(result.vars).length ? "" : "no variables",
		);
		for (const [k, v] of Object.entries(result.vars)) {
			console.log(
				`    ${chalk.yellow.bold.italic(k)}: ${v
					.map((x) => chalk.cyanBright(x))
					.join(chalk.gray(", "))}`,
			);
		}
	});

export default command;
