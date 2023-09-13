async function getUserDetails(username, token) {
    const url = "http://localhost:5000/api/Users/" + username;
    const res = await fetch(url, {
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    if (res === null) {
        return null;
    }
    return await res.json()
}


export { getUserDetails };