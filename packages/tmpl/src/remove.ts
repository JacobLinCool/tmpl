import { storage } from "./storage";
import { gitact } from "./utils";

export async function remove(name: string, tag?: string): Promise<void> {
	if (!storage.local[name].$exists) {
		throw new Error(`template ${name} does not exist`);
	}

	const git = gitact({ cwd: storage.local[name].$path });

	if (tag && !git("tag", "-l").split(/\s+/).includes(tag)) {
		throw new Error(`tag ${tag} does not exist`);
	}

	if (tag) {
		git("tag", "-d", tag);
	} else {
		storage.local[name].$remove();
	}
}
