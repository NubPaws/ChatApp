function padder(n: number): string {
	return n.toString().padStart(2, "0");
}

export function createTimeString(dateStr: string): string {
	if (dateStr !== "") {
		const date = new Date(dateStr);
		return `${padder(date.getHours())}:${padder(date.getMinutes())}`;
	}
	return "";
}

export function createDateString(dateStr: string): string {
	if (dateStr !== "") {
		const date = new Date(dateStr);
		// getMonth() is zero-based.
		const day = padder(date.getDate());
		const month = padder(date.getMonth() + 1);
		const year = date.getFullYear();
		return `${createTimeString(dateStr)} ${day}/${month}/${year}`;
	}
	return "";
}

function dateStrToObj(dateStr: string | null): Date {
	if (dateStr == null || dateStr === "") {
		return new Date(0);
	}
	return new Date(dateStr);
}

/** Sorts more-recent dates first: -1 if date1 is newer, 1 if older, 0 if equal. */
export function compareDates(dateStr1: string, dateStr2: string): number {
	const date1 = dateStrToObj(dateStr1);
	const date2 = dateStrToObj(dateStr2);
	return date1 < date2 ? 1 : date1 > date2 ? -1 : 0;
}
