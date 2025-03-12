import { RequestFromViewToContent } from "../App.tsx";
import { createRoot } from "react-dom/client";
import "../index.css";
import { App } from "../App.tsx";

const IS_EXTENSION = typeof browser !== "undefined";

export type RequestFromContentToBackground = { type: "GET_USER_INFO" };

type ResponseFromBackgroundToContent = {
  type: "USER_INFO_RESPONSE";
  data: {
    firstName: string;
    lastName: string;
  };
};

// Get URL for extension resources using browser.runtime.getURL
const getExtensionResourceUrl = (path: string): string => {
  if (IS_EXTENSION) {
    return browser.runtime.getURL(path);
  }
  return path; // Fallback for non-extension environment
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

// Create a message to send extension resource URLs to the React app
const sendExtensionResourceUrls = () => {
  const resourceUrls = {
    type: "EXTENSION_RESOURCE_URLS",
    data: {
      xxlImage: getExtensionResourceUrl("assets/xxl.png"),
    },
  };
  console.log("Sending extension resource URLs to view", resourceUrls);
  window.postMessage(resourceUrls, "*");
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
      } else if (event.data.type === "GET_EXTENSION_RESOURCES") {
        // Handle request to get extension resources
        sendExtensionResourceUrls();
      }
    }
  );

  // Send resource URLs as soon as content script loads
  setTimeout(() => {
    sendExtensionResourceUrls();
  }, 100);
}

const root = document.createElement("div");
root.id = "dummy-extension-root";
document.body.insertAdjacentElement("afterend", root);

createRoot(document.getElementById("dummy-extension-root")!).render(<App />);
