import { RequestFromViewToContent } from "../App.tsx";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "../App.tsx";

const IS_EXTENSION = typeof browser !== "undefined";

export type RequestFromContentToBackground = { type: "GET_USER_INFO" };

type ResponseFromBackgroundToContent = {
  type: "USER_INFO_RESPONSE";
  data: {
    firstName: string;
    lastName: string;
  };
};

const sendRequestFromContentToBackground = (
  request: RequestFromContentToBackground
) => {
  console.log("Sending request from content to background", request);
  return browser.runtime.sendMessage(request);
};

const sendResponseFromContentToView = (response: unknown) => {
  const typedResponse = response as ResponseFromBackgroundToContent;
  console.log("Sending response from content to view", typedResponse);
  window.postMessage(typedResponse, "*");
};

if (IS_EXTENSION) {
  window.addEventListener(
    "message",
    (event: MessageEvent<RequestFromViewToContent>) => {
      if (event.data.type === "GET_USER_INFO") {
        console.log("Received request from view to content", event.data);
        return sendRequestFromContentToBackground({
          type: "GET_USER_INFO",
        }).then(sendResponseFromContentToView);
      }
    }
  );
}

const root = document.createElement("div");
root.id = "dummy-extension-root";
document.body.insertAdjacentElement("afterend", root);

createRoot(document.getElementById("dummy-extension-root")!).render(<App />);
