import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import { list } from "@/list";
import { remove } from "@/remove";
import { storage } from "@/storage";
import { fatal } from "@/utils";
import * as validation from "@/validation";

export const command = new Command("remove")
	.alias("rm")
	.description("remove a template")
	.argument("[name]", "template name", "")
	.argument("[tag]", "template tag", "")
	.action(async (name: string, tag: string) => {
		const templates = storage.local.$list();

		if (templates.length === 0) {
			ora().fail(
				`There is no template to remove, try ${chalk.yellowBright(
					"tmpl make",
				)} or ${chalk.yellowBright("tmpl import")} to add one first`,
			);
			return;
		}

		if (!name || validation.name(name) !== true) {
			const { name: n } = await inquirer.prompt([
				{
					type: "list",
					name: "name",
					message: "Template name",
					choices: templates,
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

		const spinner = ora(
			tag ? `Removing template ${name}:${tag}` : `Removing template ${name}`,
		).start();
		await remove(name, tag).catch((err) => fatal(err, spinner.fail.bind(spinner)));
		spinner.succeed(tag ? `Removed template ${name}:${tag}` : `Removed template ${name}`);
	});

export default command;
