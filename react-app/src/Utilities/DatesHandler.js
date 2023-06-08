
/**
 * @param {number} n 
 */
function padder(n) {
	return n.toString().padStart(2, '0');
}

/**
 * @param {string} dateStr 
 */
export function createDateString(dateStr) {
	if (dateStr !== "") {
		const date = new Date(dateStr);
		// The count starts at zero
		const day = padder(date.getDate());
		const month = padder(date.getMonth() + 1);
		const year = date.getFullYear();
		return `${createTimeString(dateStr)} ${day}/${month}/${year}`;
	}
	return "";
}

/**
 * @param {string} dateStr 
 */
export function createTimeString(dateStr) {
	if (dateStr !== "") {
		const date = new Date(dateStr);
		return `${padder(date.getHours())}:${padder(date.getMinutes())}`;;
	}
	return "";
}

function dateStrToObj(dateStr) {
	if (dateStr == null || dateStr === "") {
		return new Date(0);
	}
	return new Date(dateStr);
}

export function compareDates(dateStr1, dateStr2) {
	const date1 = dateStrToObj(dateStr1);
	const date2 = dateStrToObj(dateStr2);
	
	return date1 < date2 ? 1 : date1 > date2 ? -1 : 0;
}
