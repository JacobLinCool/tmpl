import * as validation from "../src/validation";

describe("validation", () => {
	test("name", (done) => {
		expect(validation.name(undefined)).toBe("template name is required");

		expect(validation.name("")).toBe("template name cannot be empty");

		expect(validation.name(" ")).toBe(
			"template name can only contain alphanumeric characters, numbers, underscores, dashes and dots",
		);

		expect(validation.name("test")).toBe(true);

		done();
	});

	test("remote", (done) => {
		expect(validation.remote(undefined)).toBe("remote is required");

		expect(validation.remote("")).toBe("remote is not a valid URL");
		expect(validation.remote(" ")).toBe("remote is not a valid URL");
		expect(validation.remote("test")).toBe("remote is not a valid URL");

		expect(validation.remote("https://github.com/jacoblincool/tmpl")).toBe(true);

		done();
	});

	test("tag", (done) => {
		expect(validation.tag(undefined)).toBe(true);
		expect(validation.tag("")).toBe(true);

		expect(validation.tag(" ")).toBe(
			"tag can only contain alphanumeric characters, numbers, underscores, dashes and dots",
		);

		expect(validation.tag("test")).toBe(true);

		done();
	});
});
