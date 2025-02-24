import "./App.css";
import { useEffect, useState } from "react";

type ResponseFromContentToView = {
  type: "USER_INFO_RESPONSE";
  data: {
    firstName: string;
    lastName: string;
  };
};

export type RequestFromViewToContent = { type: "GET_USER_INFO" };

function App() {
  const [userInfo, setUserInfo] = useState("");

  useEffect(() => {
    const listener = (message: MessageEvent<ResponseFromContentToView>) => {
      if (message.data.type === "USER_INFO_RESPONSE") {
        console.log("Received response from content to view", message.data);
        setUserInfo(
          message.data.data.firstName + " " + message.data.data.lastName,
        );
      }
    };

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  function sendRequestFromViewToContent(request: RequestFromViewToContent) {
    console.log("Sending request from view to content", request);
    window.postMessage(request, "*");
  }

  function fetchName() {
    sendRequestFromViewToContent({ type: "GET_USER_INFO" });
  }

  return (
    <>
      <div>
        <button onClick={fetchName}>Afficher mon nom</button>
        <p>{userInfo}</p>
      </div>
    </>
  );
}

export default App;
