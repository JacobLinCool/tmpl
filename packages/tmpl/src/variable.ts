import fs from "node:fs";
import type { Stats } from "node:fs";
import path from "node:path";
import { KB } from "./constants";

export function scan(
	files: string[],
	{
		pattern = /\$#([a-zA-Z0-9_.-]+)#\$/g,
		dir = process.cwd(),
		skip = (stats: Stats & { path: string }) => stats.size > 256 * KB,
	} = {},
): Record<string, string[]> {
	const variables: Record<string, string[]> = {};

	files.forEach((file) => {
		const src = path.join(dir, file);

		if (skip({ ...fs.statSync(src), path: src })) {
			return;
		}

		const content = fs.readFileSync(src, "utf8");
		const matches = content.match(pattern)?.map((x) => x.replace(pattern, "$1").toUpperCase());
		if (matches?.length) {
			for (const match of matches) {
				if (!variables[match]) {
					variables[match] = [];
				}
				variables[match].push(file);
			}
		}
	});

	return variables;
}

export function replace(
	files: string[],
	variables: Record<string, string>,
	{
		pattern = /\$#([a-zA-Z0-9_.-]+)#\$/g,
		dir = process.cwd(),
		skip = (stats: Stats & { path: string }) => stats.size > 256 * KB,
	} = {},
): void {
	files.forEach((file) => {
		const src = path.join(dir, file);

		if (skip({ ...fs.statSync(src), path: src })) {
			return;
		}

		const content = fs.readFileSync(src, "utf8");

		const replaced = content.replace(pattern, (match, name) => {
			return variables[name.toUpperCase()] ?? match;
		});

		fs.writeFileSync(src, replaced, "utf8");
	});
}
