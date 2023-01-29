import { execSync } from "node:child_process";
import path from "node:path";
import type { Dir } from "./peek";

export function check_git(): void {
	const ok = gitact()("version").startsWith("git version");

	if (!ok) {
		throw new Error("git is not found, please install git first");
	}
}

export function gitact(opt?: { cwd?: string }): (...args: string[]) => string {
	const cwd = opt?.cwd ?? process.cwd();
	const env = { ...process.env };

	return (...args: string[]) => {
		const cmd = args.map((x) => (x.includes(" ") ? `"${x}"` : x)).join(" ");
		try {
			return execSync(`git ${cmd}`, {
				encoding: "utf8",
				cwd,
				env,
				stdio: ["ignore", "pipe", "pipe"],
			}).trim();
		} catch (err) {
			throw new Error(`[${cwd}] git ${cmd} failed: ${err}`);
		}
	};
}

export function fatal<T = any>(err: unknown, cb?: (msg: string) => void): T {
	if (err instanceof Error) {
		cb?.(err.message);
	} else {
		console.error(err);
	}
	process.exit(1);
}

export function tree_to_list(root: Dir): string[] {
	const files: string[] = [];

	function walk(dir: Record<string, unknown>, target: string) {
		for (const file in dir) {
			const next = path.join(target, file);

			if (dir[file] === true) {
				files.push(next);
			} else {
				walk(dir[file] as Record<string, unknown>, next);
			}
		}
	}

	walk(root, "");

	return files;
}
