import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		// Integration tests share an in-memory MongoDB and mutate the module-level
		// ID counters in DatabaseConnector, so keep test files from running in
		// parallel with one another.
		fileParallelism: false,
		coverage: {
			provider: "v8",
			include: ["src/**"],
			exclude: ["src/server.js", "src/test/**", "src/**/*.test.js"],
		},
	},
});
