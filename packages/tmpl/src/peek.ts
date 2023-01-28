import fs from "node:fs";
import path from "node:path";
import { storage } from "./storage";
import { gitact } from "./utils";
import * as variable from "./variable";

export interface Dir {
	[key: string]: Dir | true;
}

export async function peek(
	name: string,
	tag?: string,
): Promise<{ files: Dir; vars: Record<string, string[]> }> {
	if (!storage.local[name].$exists) {
		throw new Error(`template ${name} does not exist`);
	}

	const git = gitact({ cwd: storage.local[name].$path });

	if (tag && !git("tag", "-l").split(/\s+/).includes(tag)) {
		throw new Error(`tag ${tag} does not exist`);
	}

	if (tag) {
		git("checkout", tag);
	} else {
		git("checkout", "main");
	}

	const root: Dir = {};
	const scan_targets: string[] = [];

	function walk(dir: Dir, target: string) {
		const files = fs.readdirSync(path.join(storage.local[name].$path, target));

		for (const file of files) {
			if (file === ".git") {
				continue;
			}

			const next = path.join(target, file);

			const files: string[] = [];
			if (fs.statSync(path.join(storage.local[name].$path, next)).isDirectory()) {
				dir[file] = {};
				walk(dir[file] as Dir, next);
			} else {
				files.push(file);
				scan_targets.push(next);
			}
			files.forEach((file) => (dir[file] = true));
		}
	}

	walk(root, "");

	const vars = variable.scan(scan_targets, { dir: storage.local[name].$path });

	return {
		files: root,
		vars,
	};
}
