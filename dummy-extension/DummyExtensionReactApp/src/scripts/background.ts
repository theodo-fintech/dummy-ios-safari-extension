import { RequestFromContentToBackground } from "./content.tsx";

type RequestFromBackgroundToApplication = { type: "GET_USER_INFO" };
type ResponseFromApplicationToBackground = {
  type: "USER_INFO_RESPONSE";
  data: {
    firstName: string;
    lastName: string;
  };
};

const sendResponseFromBackgroundToContent = (response: unknown) => {
  console.log("Received response from App to background", response);
  return response as ResponseFromApplicationToBackground;
};

const sendRequestFromBackgroundToApplication = (
  request: RequestFromBackgroundToApplication
) => {
  console.log("Sending request from background to application", request);
  return browser.runtime.sendNativeMessage("dummy-extension", request);
};

browser.runtime.onMessage.addListener((message) => {
  const typedMessage = message as RequestFromContentToBackground;

  if (typedMessage.type === "GET_USER_INFO") {
    console.log("Received request from content to background", typedMessage);
    return sendRequestFromBackgroundToApplication({
      type: "GET_USER_INFO",
    }).then(sendResponseFromBackgroundToContent);
  }
});
