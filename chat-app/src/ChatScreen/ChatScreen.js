import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function ChatScreen(props) {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (props.currentUser === "") {
          navigate("/login")
        }
      }, [props.currentUser, props.setCurrentUser])
    // if (props.userCredentials === "" || !props.userCredentials["logged in"]) {
    //     alert("Please register");
    //     navigate("/login");
    // }
    return (
        <div>Chat Screen</div>
    );
}