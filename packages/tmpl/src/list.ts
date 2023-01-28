import { storage } from "./storage";
import { gitact } from "./utils";

export async function list(): Promise<Record<string, string[]>> {
	const keys = storage.local.$list();

	const result: Record<string, string[]> = {};

	for (const key of keys) {
		const git = gitact({ cwd: storage.local[key].$path });
		const tags = git("tag", "-l").split(/\s+/).filter(Boolean);
		result[key] = tags;
	}

	return result;
}
