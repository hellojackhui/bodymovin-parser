import version from "../packages/css/index";

test("当前项目版本为 1.0.0", () => {
  expect(version.version).toBe("1.0.0");
});