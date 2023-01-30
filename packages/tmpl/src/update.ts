import globby from "globby";
import { storage } from "./storage";
import { gitact } from "./utils";
import * as variable from "./variable";

export async function update(name: string): Promise<Record<string, string[]>> {
	if (!storage.local[name].$exists) {
		throw new Error(`template ${name} does not exist`);
	}

	const git = gitact({ cwd: storage.local[name].$path });
	git("pull");

	const files = await globby(["**", "!**/.git"], {
		cwd: storage.local[name].$path,
		dot: true,
		gitignore: true,
	});

	return variable.scan(files, { dir: storage.local[name].$path });
}
