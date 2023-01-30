import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import { list } from "@/list";
import { update } from "@/update";
import { fatal } from "@/utils";
import * as validation from "@/validation";

export const command = new Command("update")
	.description("update remote templates")
	.argument("[name]", "template name (emit to update all)", "")
	.action(async (name: string) => {
		const templates = Object.entries(await list()).filter(([k, v]) => v.remote);

		if (templates.length === 0) {
			ora().fail(
				`There is no remote template to update, try ${chalk.yellowBright(
					"tmpl import",
				)} to import one first`,
			);
			return;
		}

		if (name && validation.name(name) !== true) {
			const { name: n } = await inquirer.prompt([
				{
					type: "list",
					name: "name",
					message: "Template name",
					choices: templates.map(([k]) => k),
					validate: validation.name,
				},
			]);
			name = n;
		}

		const targets = name ? [name] : templates.map(([k]) => k);

		for (const name of targets) {
			const remote = templates.find(([k]) => k === name)?.[1].remote;

			const spinner = ora(
				`Updating template ${chalk.greenBright(name)} ${chalk.gray(remote)}`,
			).start();

			const vars = await update(name).catch((err) =>
				fatal<Record<string, string[]>>(err, spinner.fail.bind(spinner)),
			);

			spinner.succeed(`Template ${chalk.greenBright(name)} is up to date!`);
			console.log(chalk.bold("Variables:"), Object.keys(vars).length ? "" : "no variables");
			for (const [k, v] of Object.entries(vars)) {
				console.log(
					`    ${chalk.yellow.italic(k)}: ${v
						.map((x) => chalk.cyanBright(x))
						.join(chalk.gray(", "))}`,
				);
			}
		}
	});

export default command;
