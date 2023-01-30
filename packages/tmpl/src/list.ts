import { storage } from "./storage";
import { gitact } from "./utils";

export type TemplateList = Record<string, { tags: string[]; remote?: string }>;

export async function list(): Promise<TemplateList> {
	const keys = storage.local.$list();

	const result: TemplateList = {};

	for (const key of keys) {
		const git = gitact({ cwd: storage.local[key].$path });

		const tags = git("tag", "-l").split(/\s+/).filter(Boolean);
		result[key] = { tags };

		try {
			result[key].remote = git("remote", "get-url", "origin");
		} catch {}
	}

	return result;
}
