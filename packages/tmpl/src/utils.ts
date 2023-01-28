import { execSync } from "node:child_process";

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
				stdio: ["ignore", "pipe", "ignore"],
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
