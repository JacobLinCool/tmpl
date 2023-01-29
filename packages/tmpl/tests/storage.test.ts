import os from "node:os";
import path from "node:path";
import { TMPL_HOME } from "../src";

test("TMPL_HOME", () => {
	expect(TMPL_HOME).toBe(path.join(os.tmpdir(), "tmpl-test"));
});
