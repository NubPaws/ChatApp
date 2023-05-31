import { handleUsername, handlePassword, confirmPassword, handleDisplayName } from "./Validation.js";

async function registerUser(event, setShowSuccessMessage, setShowErrorMessage) {
    event.preventDefault();
    // Checking for registration success
    if (handleUsername() && handlePassword() && confirmPassword() && handleDisplayName()) {
        // registering user
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let displayName = document.getElementById("displayName").value;
        let profilePicture = document.getElementById("profilePicture").files[0];

        // Converting the image from blob object to base64
        let base64ProfileImage = await convertImageToBase64(profilePicture);
        let userData = {
            "username": username,
            "password": password,
            "displayName": displayName,
            "profilePic": base64ProfileImage
        };

        const res = await fetch(document.getElementById("registrationForm").action, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify(userData)
        }
        )
        if (res.status !== 200) {
            setShowErrorMessage(true);
        }
        else {
            setShowSuccessMessage(true);
        }
    }
}

function previewProfilePicture(event) {
    var src = URL.createObjectURL(event.target.files[0])
    let preview = document.getElementById('preview');
    preview.src = src;
    preview.style.height = "150px";
    preview.style.width = "150px";
}


function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result )
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
}

export { registerUser, previewProfilePicture }