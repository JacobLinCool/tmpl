const os = require("node:os");
const path = require("node:path");
const fs = require("node:fs");

process.env.TMPL_HOME = path.join(os.tmpdir(), "tmpl-test");
if (fs.existsSync(process.env.TMPL_HOME)) {
	fs.rmSync(process.env.TMPL_HOME, { recursive: true });
}
