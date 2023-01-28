import globby from "globby";
import { storage } from "./storage";
import { gitact } from "./utils";
import * as variable from "./variable";

async function import_template(name: string, remote: string): Promise<Record<string, string[]>> {
	if (storage.local[name].$exists) {
		throw new Error(`template ${name} already exists`);
	}

	const git = gitact({ cwd: storage.local.$path });

	git("clone", remote, name);

	const files = await globby(["**", "!**/.git"], {
		cwd: storage.local[name].$path,
		dot: true,
		gitignore: true,
	});

	return variable.scan(files, { dir: storage.local[name].$path });
}

export { import_template as import };
