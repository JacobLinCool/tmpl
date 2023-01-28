import os from "node:os";
import path from "node:path";
import { z, File, mount } from "controlled-fs";

const TMPL_HOME = process.env.TMPL_HOME || path.join(os.homedir(), ".tmpl");

const structure = z.object({
	local: z.record(z.string(), z.record(z.string(), File(z.any()))),
	remote: z.record(z.string(), z.record(z.string(), File(z.any()))),
});

const storage = mount(TMPL_HOME, structure);

if (!storage.local.$exists) {
	storage.local.$fs.mkdirSync({ recursive: true });
}

if (!storage.remote.$exists) {
	storage.remote.$fs.mkdirSync({ recursive: true });
}

export { TMPL_HOME, storage };
