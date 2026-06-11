const MIN_USERNAME_LENGTH = 4;
const MIN_PASSWORD_LENGTH = 8;

/** Returns an error message, or null when the value is valid. */
export function validateUsername(username: string): string | null {
	if (username.length < MIN_USERNAME_LENGTH) {
		return `Username needs to have at least ${MIN_USERNAME_LENGTH} characters`;
	}
	return null;
}

export function validatePassword(password: string): string | null {
	if (password.length < MIN_PASSWORD_LENGTH) {
		return `Password needs have at least ${MIN_PASSWORD_LENGTH} characters`;
	}
	return null;
}

export function validateConfirmPassword(confirmPassword: string, password: string): string | null {
	if (confirmPassword.length < MIN_PASSWORD_LENGTH) {
		return `Password needs have at least ${MIN_PASSWORD_LENGTH} characters`;
	}
	if (confirmPassword !== password) {
		return "Passwords do not match";
	}
	return null;
}

export function validateDisplayName(displayName: string): string | null {
	if (displayName.length === 0) {
		return "Display Name can't be empty";
	}
	return null;
}
