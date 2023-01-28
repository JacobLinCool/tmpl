export const name = (x?: string) => {
	const regex = /^[a-zA-Z0-9_.-]+$/;
	if (x === undefined) {
		return "template name is required";
	}
	if (x.length === 0) {
		return "template name cannot be empty";
	}
	if (!regex.test(x)) {
		return "template name can only contain alphanumeric characters, numbers, underscores, dashes and dots";
	}
	return true;
};

export const remote = (x?: string) => {
	if (x === undefined) {
		return "remote is required";
	}
	try {
		new URL(x);
		return true;
	} catch {
		return "remote is not a valid URL";
	}
};

export const tag = (x?: string) => {
	const regex = /^[a-zA-Z0-9_.-]+$/;
	if (x === undefined || x.length === 0) {
		return true;
	}
	if (!regex.test(x)) {
		return "tag can only contain alphanumeric characters, numbers, underscores, dashes and dots";
	}
	return true;
};
