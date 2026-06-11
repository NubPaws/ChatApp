// Augments Express's Request with the username attached by the auth middleware.
import "express";

declare global {
	namespace Express {
		interface Request {
			username?: string;
		}
	}
}
