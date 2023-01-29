import { tree_to_list } from "../src/utils";

describe("utils", () => {
	test("tree_to_list", (done) => {
		expect(
			tree_to_list({
				a: true,
			}),
		).toStrictEqual(["a"]);

		expect(
			tree_to_list({
				a: {
					b: true,
				},
			}),
		).toStrictEqual(["a/b"]);

		expect(
			tree_to_list({
				a: {
					b: {
						c: true,
					},
				},
			}),
		).toStrictEqual(["a/b/c"]);

		expect(
			tree_to_list({
				a: {
					b: true,
				},
				c: true,
			}),
		).toStrictEqual(["a/b", "c"]);

		expect(
			tree_to_list({
				a: {
					b: true,
				},
				c: {
					d: true,
				},
			}),
		).toStrictEqual(["a/b", "c/d"]);

		expect(
			tree_to_list({
				a: {
					b: true,
					c: true,
				},
				d: {
					e: true,
					f: true,
				},
			}),
		).toStrictEqual(["a/b", "a/c", "d/e", "d/f"]);

		done();
	});
});
