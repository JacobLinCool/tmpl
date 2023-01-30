#!/usr/bin/env node
import { program } from "commander";
import { pkg } from "@/core";
import edit from "@cli/edit";
import import_remote from "@cli/import";
import list from "@cli/list";
import make from "@cli/make";
import peek from "@cli/peek";
import remove from "@cli/remove";
import update from "@cli/update";
import use from "@cli/use";

program
	.version(pkg.version)
	.addCommand(make)
	.addCommand(use)
	.addCommand(list)
	.addCommand(peek)
	.addCommand(remove)
	.addCommand(import_remote)
	.addCommand(edit)
	.addCommand(update)
	.parse();
