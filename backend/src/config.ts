import { config as loadEnv } from "dotenv";
import { z } from "zod";

// Load variables from a local .env file (does not override real env vars).
loadEnv();

const envSchema = z.object({
	PORT: z.coerce.number().int().positive().default(5000),
	// Required: there is intentionally no insecure default. The server fails fast
	// at boot if this is missing.
	JWT_KEY: z.string().min(1, "JWT_KEY is required"),
	MONGO_URI: z.string().default("mongodb://127.0.0.1:27017/"),
	MONGO_DB_NAME: z.string().default("chat"),
	NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	const issues = parsed.error.issues
		.map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
		.join("\n");
	throw new Error(`Invalid environment configuration:\n${issues}`);
}

/** Validated, immutable application configuration. */
export const config = Object.freeze({
	port: parsed.data.PORT,
	jwtKey: parsed.data.JWT_KEY,
	mongoUri: parsed.data.MONGO_URI,
	mongoDbName: parsed.data.MONGO_DB_NAME,
	nodeEnv: parsed.data.NODE_ENV,
});

export type AppConfig = typeof config;
