import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import { make } from "@/make";
import { fatal } from "@/utils";
import * as validation from "@/validation";

export const command = new Command("make")
	.alias("mk")
	.description("make or update a template from directory")
	.argument("[name]", "template name", "")
	.argument("[tag]", "template tag", "")
	.option("-d, --dir <dir>", "directory to make from")
	.option("-e, --exclude <exclude...>", "exclude files (glob pattern)")
	.option("-i, --include <include...>", "include files (glob pattern)")
	.action(
		async (
			name: string,
			tag: string,
			{ dir, exclude, include }: { dir?: string; exclude?: string[]; include?: string[] },
		) => {
			if (!name || validation.name(name) !== true) {
				const { name: n } = await inquirer.prompt([
					{
						type: "input",
						name: "name",
						message: "Template name",
						default: name || undefined,
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
				tag ? `Making template ${name} with tag ${tag}` : `Making template ${name}`,
			).start();
			const vars = await make(name, tag, { dir, excludes: exclude, includes: include }).catch(
				(err) => fatal<Record<string, string[]>>(err, spinner.fail.bind(spinner)),
			);
			spinner.succeed(`Template ${tag ? `${name}:${tag}` : name} is made!`);

			console.log(
				chalk.bold("Variables:"),
				Object.keys(vars).length
					? ""
					: `no variables (tips: use ${chalk.yellowBright(
							"$#" + "NAME" + "#$",
					  )} to mark variables in files)`,
			);
			for (const [k, v] of Object.entries(vars)) {
				console.log(
					`    ${chalk.yellow.italic(k)}: ${v
						.map((x) => chalk.cyanBright(x))
						.join(chalk.gray(", "))}`,
				);
			}
		},
	);

export default command;
