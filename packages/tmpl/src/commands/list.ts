import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { list } from "@/list";
import { fatal } from "@/utils";

export const command = new Command("list")
	.alias("ls")
	.description("list all templates")
	.action(async () => {
		const spinner = ora("Listing templates").start();
		const templates = await list().catch((err) =>
			fatal<Record<string, string[]>>(err, spinner.fail.bind(spinner)),
		);
		spinner.stop();

		console.log(chalk.bold("Templates:"));
		for (const [name, tags] of Object.entries(templates)) {
			console.log(
				`  ${chalk.cyanBright.bold(name)}`,
				...tags.map((x) => chalk.yellow.italic(x)),
			);
		}
	});

export default command;
