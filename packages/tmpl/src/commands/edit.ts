import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import { list } from "@/list";
import { peek } from "@/peek";
import { storage } from "@/storage";
import { fatal, tree_to_list } from "@/utils";
import * as validation from "@/validation";

export const command = new Command("edit")
	.argument("[name]", "template name", "")
	.argument("[tag]", "template tag", "")
	.description("edit a template")
	.action(async (name: string, tag: string) => {
		const templates = Object.keys(await list());

		if (templates.length === 0) {
			ora().fail(
				`There is no template to edit, try ${chalk.yellowBright(
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

		const spinner = ora("Preparing the template files...").start();

		try {
			const { files } = await peek(name, tag);

			const tmp = path.join(os.tmpdir(), ".tmpl", name, tag || "_");
			if (fs.existsSync(tmp)) {
				fs.rmSync(tmp, { recursive: true });
			}
			fs.mkdirSync(tmp, { recursive: true });

			const src_root = storage.local[name].$path;
			const targets = tree_to_list(files);

			for (const target of targets) {
				const src = path.join(src_root, target);
				const dst = path.join(tmp, target);
				const parent = path.dirname(dst);
				if (!fs.existsSync(parent)) {
					fs.mkdirSync(parent, { recursive: true });
				}
				fs.copyFileSync(src, dst);
			}

			spinner.succeed("Template files are ready");

			console.log(chalk.italic("Edit the template files in the following directory:"));
			console.log("    " + chalk.yellowBright.bold(tmp));
			console.log(
				chalk.italic(
					"When you are done, run the following command in the directory to save the changes:",
				),
			);
			console.log(
				"    " + chalk.yellowBright.bold(`tmpl make ${name}${tag ? " " + tag : ""}`),
			);
		} catch (err) {
			fatal(err, spinner.fail.bind(spinner));
		}
	});

export default command;
