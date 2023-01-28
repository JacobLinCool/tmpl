import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import { import as import_template } from "@/import";
import { fatal } from "@/utils";
import * as validation from "@/validation";

export const command = new Command("import")
	.description("import a template from a remote git repository")
	.argument("[name]", "template name", "")
	.argument("[remote]", "remote git repository", "")
	.action(async (name: string, remote: string) => {
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

		if (!remote || validation.remote(remote) !== true) {
			const { remote: r } = await inquirer.prompt([
				{
					type: "input",
					name: "remote",
					message: "Remote git repository",
					default: remote || undefined,
					validate: validation.remote,
				},
			]);
			remote = r;
		}

		const spinner = ora(`Importing template ${name} from ${remote}`).start();
		const vars = await import_template(name, remote).catch((err) =>
			fatal<Record<string, string[]>>(err, spinner.fail.bind(spinner)),
		);
		spinner.succeed(`Template ${name} is imported!`);

		console.log(chalk.bold("Variables:"), Object.keys(vars).length ? "" : "no variables");
		for (const [k, v] of Object.entries(vars)) {
			console.log(
				`    ${chalk.yellow.italic(k)}: ${v
					.map((x) => chalk.cyanBright(x))
					.join(chalk.gray(", "))}`,
			);
		}
	});

export default command;
