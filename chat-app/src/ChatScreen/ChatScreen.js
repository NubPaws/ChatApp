import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function logout(setAllowChatScreen, setCurrentUser) {
  setAllowChatScreen(false);
  setCurrentUser("");
}

export function ChatScreen(props) {
    const navigate = useNavigate();
    useEffect(() => {
        if (props.allowChatScreen === false) {
          navigate("/login")
        }
      }, [props.allowChatScreen, props.setAllowChatScreen]);


    return (
        <div>Chat Screen<br></br>
          <button className="btn btn-light" onClick={(event) => logout(props.setAllowChatScreen, props.setCurrentUser)}>Logout?</button>
        </div>
        
    );
}