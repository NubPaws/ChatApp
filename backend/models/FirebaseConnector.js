import admin from "firebase-admin";

// Should be hidden but for the purpose of this project it is visible on GitHub.
// A new token will be generated before we go public!
const serviceAccountKey = {
	type: "service_account",
	project_id: "rcchat-3b8f0",
	private_key_id: "8c492e33c1c26b886b80f91ccabf148285d0657b",
	private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDTNvJHl1OgIqqv\ngQFsQ5GCP6zB7O9DycDgR6eCXWbNMr6AsyK5/A4iqJ882ir+rdecFNz6b85Ilw+X\nyoLpcuP1xCCve8PcKFDmjsRBaXH1nMaQvP2oh/XCH8YxPMYPQBp0PZ4h/d0N8rwi\nnVPOTWh+iBdQgBOSYPxWO1OghXdFnq1PUhprZAfGh6PLj3t2/cvBxMrnS/lprAM0\n8N7iSFkdqempifBbEbfUky4h2dI5t+QjQ/DgMKYUQrGJbqQTFHusvxHaBvgnydwh\noaxpfkXdHsP4wcV2L9LvmYg7vB7VxhLjwePYqXVRsRcUaRqRmg16Wgo0X7NtDHek\nNT5HOfpnAgMBAAECggEAWuWOptitGIFSy2zNW/ZILLGSe3KoFZhB9UNhB22CzFRG\nP8TX8QpUWv4OaXXKgwf1fipMX0q2j+7SuxRf+m+DQ0VAe8TbqWeASXivZScn7/ek\nTK3IzDqWvRBHjvEEm5OOzu+lmiNSeqo35P2oD2Soz6tpvS8hPSGX9tRZTP+jMMYs\nP4SUXMjF8waoDnzn2NkcBpnV/orGi8W7xOjxmOtA1RzDuubn26YZ/2ScCGfzfjzl\nMlIMR01AN3e/991y4eZNXNHowjmVi9P0NpKiYdhF08BuB1QpKM1qpKY/QRlZVOOp\nXqO3E11I5onNj04irJ/Y5gm8BmBr4ZbW1KZqaXAbQQKBgQD62DqeoCCXrR73/cU2\nARrNNy+8MsTjuMZ2OpKfxZAYO+gA28Wv1xf6TbU3aLDenqAdN6Oec1sLtkcmnLEB\niZw1FPJoxTE9/Ff96preLwS+ispQziE1BaGeAB5g73Be02yjpj8Y+Bpgg7O1brWt\nFh2VVhM0o6H+xqe5PCd0ilAxbwKBgQDXjjYzRteCSnQ5m7bTcN4fCeTIMZkVRLxi\nAMBvF8+CoV7t2nyFVIp7JOx0lxFjqlaX1mTBS08ps0SPnKKGZ7GTIsn1nXkJq0SO\nf5QH4SK4xXmTX3heN+39S2bucoWHUFPb7BnZlv9y4KCB6f838OE+UvGH1M/73aoM\nwusyMbnaiQKBgHbiC8Yp9chs0ASQTOrvUxh3UzRKi22xoL1fvSXjqAsUOTxO7D4O\nHtsOARilkU2wuAmg2Pa7jSbb2JTAJlOoOFQf/VMSQegytDEvAv7SIdl8Ra5OQway\nCIqtW7htQkBuy0oz/CuFSlr7kCwosAm8NYEVLj0AYEIzPEJZ9AkTlDYZAoGBANEc\nu2P/Q664QAxrDXAOPM3rsTCtPQ8vAXoptIWRmdPmbMtefBJ0s2tHpMRukYYYh60B\nZflG7+NKcCbKE7lD+zb8NuS6AePpbLa4+YizVhXeLVVU9tagd5aUgaStIPDmcpQV\ndfZq0CJH3C5sLRW97yWhHYNiZuq2XfPHXJfzOZPRAoGAAaxK/rjYBANWB1aBobio\nvEK2Aj9KHSF9jxIlbBImuEbrTb29FFr1daMB59mq73piEh6X5b3HMHSK9ubOsyjH\n7NZLVw+xqE123Jm0jbKMbCsckdiWxLeimlAwxNIVpweoW7vbHc6r7giJQRbbBFCc\nmFAD3iLD9uHBNUGc8KOhTvg=\n-----END PRIVATE KEY-----\n",
	client_email: "firebase-adminsdk-8kik2@rcchat-3b8f0.iam.gserviceaccount.com",
	client_id: "110898392122965792286",
	auth_uri: "https://accounts.google.com/o/oauth2/auth",
	token_uri: "https://oauth2.googleapis.com/token",
	auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
	client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8kik2%40rcchat-3b8f0.iam.gserviceaccount.com",
	universe_domain: "googleapis.com",
};

export function initFirebase() {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccountKey)
	});
}
