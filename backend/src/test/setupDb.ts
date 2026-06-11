import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod;

/**
 * Starts an in-memory MongoDB instance and connects the default mongoose
 * connection to it. The model functions under test use the default connection,
 * so this transparently redirects them at the ephemeral database.
 */
export async function startTestDb() {
	mongod = await MongoMemoryServer.create();
	await mongoose.connect(mongod.getUri(), { dbName: "chat" });
}

/** Disconnects mongoose and shuts the in-memory MongoDB down. */
export async function stopTestDb() {
	await mongoose.disconnect();
	if (mongod) {
		await mongod.stop();
		mongod = undefined;
	}
}

/** Removes all documents from every collection so tests start from a clean slate. */
export async function clearTestDb() {
	const { collections } = mongoose.connection;
	for (const key of Object.keys(collections)) {
		await collections[key].deleteMany({});
	}
}
