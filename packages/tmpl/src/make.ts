import fs from "node:fs";
import path from "node:path";
import globby from "globby";
import { storage } from "./storage";
import { gitact } from "./utils";
import * as variable from "./variable";

export async function make(
	name: string,
	tag?: string,
	{
		dir = process.cwd(),
		excludes = [],
		includes = [],
	}: {
		dir?: string;
		excludes?: string[];
		includes?: string[];
	} = {},
): Promise<Record<string, string[]>> {
	if (!storage.local[name].$exists) {
		storage.local[name].$fs.mkdirSync();
	}

	storage.local[name].$list().forEach((file) => {
		if (file !== ".git") {
			storage.local[name][file].$fs.rmSync({ recursive: true });
		}
	});

	const files = await globby(["**", "!**/.git", ...includes, ...excludes.map((x) => `!${x}`)], {
		cwd: dir,
		dot: true,
		gitignore: true,
	});

	files.forEach((file) => {
		const src = path.join(dir, file);
		const dest = path.join(storage.local[name].$path, file);

		const parent = path.dirname(dest);
		if (!fs.existsSync(parent)) {
			fs.mkdirSync(parent, { recursive: true });
		}
		fs.copyFileSync(src, dest);
	});

	const git = gitact({ cwd: storage.local[name].$path });

	if (!storage.local[name][".git"].$exists) {
		git("init", "-b", "main");
	}

	git("add", ".");
	git("commit", "-m", `make template ${tag ? `${name}:${tag}` : name} from ${dir}`);

	if (tag) {
		git("tag", "-f", tag);
	}

	return variable.scan(files, { dir });
}
