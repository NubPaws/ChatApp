async function getUserDetails(username, token) {

    const url = "http://localhost:5000/api/Users/" + username;
    const res = await fetch(url, {
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
    )
    return await res.json()
}

async function getChats(token) {
    const url = "http://localhost:5000/api/Chats"
    const res = await fetch(url, {
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
    )
    return await res.json()
}

export { getUserDetails, getChats };