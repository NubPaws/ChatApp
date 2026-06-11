import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		// config.ts validates the environment at import time and requires JWT_KEY,
		// so provide test values before any module loads.
		env: {
			JWT_KEY: "test-secret-key",
			NODE_ENV: "test",
		},
		// Integration tests share an in-memory MongoDB and mutate the module-level
		// ID counters in DatabaseConnector, so keep test files from running in
		// parallel with one another.
		fileParallelism: false,
		coverage: {
			provider: "v8",
			include: ["src/**"],
			exclude: ["src/server.ts", "src/test/**", "src/**/*.test.ts", "src/types/**"],
		},
	},
});
