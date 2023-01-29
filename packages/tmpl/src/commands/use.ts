import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import { list } from "@/list";
import { use } from "@/use";
import { fatal } from "@/utils";
import * as validation from "@/validation";

export const command = new Command("use")
	.argument("[name]", "template name", "")
	.argument("[tag]", "template tag", "")
	.description("use a template")
	.option("-d, --dir <dir>", "directory to use to")
	.option("-v:<name>, --var:<name> <value>", "set the variable to use")
	.allowUnknownOption(true)
	.action(async (name: string, tag: string, opt: { dir?: string }, cmd) => {
		const templates = Object.keys(await list());

		if (templates.length === 0) {
			ora().fail(
				`There is no template to use, try ${chalk.yellowBright(
					"tmpl make",
				)} or ${chalk.yellowBright("tmpl import")} to add one first`,
			);
			return;
		}

		const args: string[] = cmd.args;
		const skips = new Set<number>();

		const variables: Record<string, string> = {};

		for (let i = 0; i < args.length; i++) {
			const arg = args[i];
			if ((arg.startsWith("-v:") || arg.startsWith("--var:")) && arg[i + 1]) {
				const [_, ...key] = arg.split(":");
				variables[key.join(":").toUpperCase()] = args[i + 1];
				skips.add(i);
				i++;
				skips.add(i);
			} else if (arg.startsWith("-d") || arg.startsWith("--dir")) {
				skips.add(i);
				i++;
				skips.add(i);
			}
		}

		for (let i = args.length - 1; i >= 0; i--) {
			if (skips.has(i)) {
				args.splice(i, 1);
			}
		}

		name = args[0];
		tag = args[1] || "";

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

		const spinner = ora();
		await use(name, tag, { dir: opt.dir, variables, interactive: true, spinner }).catch((err) =>
			fatal(err, console.error),
		);
		spinner.succeed("Template used successfully");
	});

export default command;
