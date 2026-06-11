import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { startTestDb, stopTestDb, clearTestDb } from "../test/setupDb.js";
import { addUser } from "./Users.js";
import {
	createChat,
	getChat,
	deleteChat,
	addMessageToChat,
	getLastMessageInChats,
	getAllMessagesInChat,
	getReceiver,
	SameUserChatError,
	ChatAlreadyExistsError,
	InvalidChatIdError,
	UserNotPartOfChatError,
	InvalidMessageContentError,
} from "./Chats.js";

beforeAll(startTestDb);
afterAll(stopTestDb);
afterEach(clearTestDb);

async function seedUsers() {
	await addUser("alice", "password123", "Alice", "alice.png");
	await addUser("bobby", "password123", "Bob", "bob.png");
}

/** Creates an alice<->bob chat and returns its generated numeric id. */
async function seedChat() {
	await seedUsers();
	await createChat("alice", "bobby");
	const summaries = await getLastMessageInChats("alice");
	return summaries[0].id;
}

describe("createChat", () => {
	it("creates a chat between two users", async () => {
		await seedUsers();
		await createChat("alice", "bobby");

		const chats = await getLastMessageInChats("alice");
		expect(chats).toHaveLength(1);
		expect(chats[0].user.username).toBe("bobby");
		expect(chats[0].lastMessage).toBeNull();
	});

	it("throws SameUserChatError when opening a chat with yourself", async () => {
		await seedUsers();
		await expect(createChat("alice", "alice")).rejects.toBeInstanceOf(SameUserChatError);
	});

	it("throws ChatAlreadyExistsError for a duplicate chat", async () => {
		await seedUsers();
		await createChat("alice", "bobby");
		await expect(createChat("alice", "bobby")).rejects.toBeInstanceOf(ChatAlreadyExistsError);
	});
});

describe("messages", () => {
	it("adds a trimmed message and reads it back with a reduced sender", async () => {
		const chatId = await seedChat();

		const msg = await addMessageToChat("alice", chatId, "  hello bob  ");
		expect(msg.content).toBe("hello bob");
		expect(msg.sender.username).toBe("alice");
		expect(msg._id).toBeUndefined();

		const all = await getAllMessagesInChat("bobby", chatId);
		expect(all).toHaveLength(1);
		expect(all[0].content).toBe("hello bob");
		expect(all[0].sender).toEqual({ username: "alice" });
	});

	it("rejects empty / whitespace-only message content", async () => {
		const chatId = await seedChat();
		await expect(addMessageToChat("alice", chatId, "   ")).rejects.toBeInstanceOf(
			InvalidMessageContentError,
		);
	});

	it("getLastMessageInChats reflects the most recent message", async () => {
		const chatId = await seedChat();
		await addMessageToChat("alice", chatId, "first");
		await addMessageToChat("bobby", chatId, "second");

		const summary = (await getLastMessageInChats("alice"))[0];
		expect(summary.lastMessage.content).toBe("second");
	});
});

describe("getChat access control", () => {
	it("returns a cleaned chat for a participant", async () => {
		const chatId = await seedChat();
		await addMessageToChat("alice", chatId, "hi");

		const chat = await getChat("alice", chatId);
		expect(chat.id).toBe(chatId);
		expect(chat.users.map((u) => u.username).sort()).toEqual(["alice", "bobby"]);
		expect(chat._id).toBeUndefined();
		expect(chat.messages[0].sender.username).toBe("alice");
	});

	it("throws UserNotPartOfChatError for a non-participant", async () => {
		const chatId = await seedChat();
		await addUser("carol", "password123", "Carol", "c.png");
		await expect(getChat("carol", chatId)).rejects.toBeInstanceOf(UserNotPartOfChatError);
	});

	it("throws InvalidChatIdError for a missing chat", async () => {
		await seedUsers();
		await expect(getChat("alice", 999999)).rejects.toBeInstanceOf(InvalidChatIdError);
	});
});

describe("deleteChat", () => {
	it("removes a chat the user belongs to", async () => {
		const chatId = await seedChat();
		await deleteChat("alice", chatId);
		expect(await getLastMessageInChats("alice")).toEqual([]);
	});
});

describe("getReceiver", () => {
	it("returns the other participant's username from either side", async () => {
		const chatId = await seedChat();
		expect(await getReceiver("alice", chatId)).toBe("bobby");
		expect(await getReceiver("bobby", chatId)).toBe("alice");
	});
});
