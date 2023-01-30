import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { list } from "@/list";
import type { TemplateList } from "@/list";
import { fatal } from "@/utils";

export const command = new Command("list")
	.alias("ls")
	.description("list all templates")
	.action(async () => {
		const spinner = ora("Listing templates").start();
		const templates = await list().catch((err) =>
			fatal<TemplateList>(err, spinner.fail.bind(spinner)),
		);
		spinner.stop();

		console.log(chalk.bold("Templates:"));
		for (const [name, { tags, remote }] of Object.entries(templates)) {
			console.log(
				`  ${chalk.cyanBright.bold(name)} ${chalk.gray(`(${remote || "local"})`)}`,
				...tags.map((x) => chalk.yellow.italic(x)),
			);
		}
	});

export default command;
