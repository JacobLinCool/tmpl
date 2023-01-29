import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { list } from "../src/list";
import { make } from "../src/make";
import { peek } from "../src/peek";
import { remove } from "../src/remove";
import { use } from "../src/use";

const dir = path.join(__dirname, "fixtures", "template");

describe("template without tag", () => {
	test("make", async () => {
		const vars = await make("test", undefined, { dir });

		expect(vars).toEqual({
			VAR: ["dir/file.txt", "vars.txt"],
			V_A_R: ["vars.txt"],
		});
	});

	test("peek", async () => {
		const { vars, files } = await peek("test");

		expect(vars).toEqual({
			VAR: ["dir/file.txt", "vars.txt"],
			V_A_R: ["vars.txt"],
		});
		expect(files).toEqual({
			dir: {
				"file.txt": true,
			},
			"vars.txt": true,
		});
	});

	test("list", async () => {
		const templates = await list();
		expect(templates).toEqual({
			test: [],
		});
	});

	test("use", async () => {
		const tmp = path.join(os.tmpdir(), Math.random().toString(36).slice(2));

		expect(use("test", undefined, { dir: tmp })).rejects.toThrowError();

		await use("test", undefined, { dir: tmp, variables: { VAR: "var", V_A_R: "v a r" } });

		expect(fs.readFileSync(path.join(tmp, "dir", "file.txt"), "utf8")).toContain("var");
		expect(fs.readFileSync(path.join(tmp, "vars.txt"), "utf8")).toContain("var");
		expect(fs.readFileSync(path.join(tmp, "vars.txt"), "utf8")).toContain("v a r");

		fs.rmSync(tmp, { recursive: true, force: true });
	});

	test("remove", async () => {
		await remove("test");
		const templates = await list();
		expect(templates).toEqual({});
	});
});

describe("template with tag", () => {
	const tag = "x.y.z";

	test("make", async () => {
		const vars = await make("test", tag, { dir });

		expect(vars).toEqual({
			VAR: ["dir/file.txt", "vars.txt"],
			V_A_R: ["vars.txt"],
		});
	});

	test("peek", async () => {
		const { vars, files } = await peek("test", tag);

		expect(vars).toEqual({
			VAR: ["dir/file.txt", "vars.txt"],
			V_A_R: ["vars.txt"],
		});
		expect(files).toEqual({
			dir: {
				"file.txt": true,
			},
			"vars.txt": true,
		});
	});

	test("list", async () => {
		const templates = await list();
		expect(templates).toEqual({
			test: [tag],
		});
	});

	test("use", async () => {
		const tmp = path.join(os.tmpdir(), Math.random().toString(36).slice(2));

		expect(use("test", tag, { dir: tmp })).rejects.toThrowError();

		await use("test", tag, { dir: tmp, variables: { VAR: "var", V_A_R: "v a r" } });

		expect(fs.readFileSync(path.join(tmp, "dir", "file.txt"), "utf8")).toContain("var");
		expect(fs.readFileSync(path.join(tmp, "vars.txt"), "utf8")).toContain("var");
		expect(fs.readFileSync(path.join(tmp, "vars.txt"), "utf8")).toContain("v a r");

		fs.rmSync(tmp, { recursive: true, force: true });
	});

	test("remove", async () => {
		await remove("test", tag);
		const templates = await list();
		expect(templates).toEqual({
			test: [],
		});
	});
});
