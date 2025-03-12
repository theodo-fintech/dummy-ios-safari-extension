import { useEffect, useState } from "react";
import profileIcon from "./assets/profile.svg";

type ResponseFromContentToView = {
  type: "USER_INFO_RESPONSE";
  data: {
    firstName: string;
    lastName: string;
  };
};

type ExtensionResourceUrls = {
  type: "EXTENSION_RESOURCE_URLS";
  data: {
    xxlImage: string;
  };
};

export type RequestFromViewToContent = {
  type: "GET_USER_INFO" | "GET_EXTENSION_RESOURCES";
};

export const App = () => {
  const [userInfo, setUserInfo] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [resourceUrls, setResourceUrls] = useState<{
    xxlImage: string;
  }>({
    xxlImage: "",
  });

  useEffect(() => {
    const listener = (
      message: MessageEvent<ResponseFromContentToView | ExtensionResourceUrls>
    ) => {
      if (message.data.type === "USER_INFO_RESPONSE") {
        console.log("Received response from content to view", message.data);
        setUserInfo(
          message.data.data.firstName + " " + message.data.data.lastName
        );
        setIsOpen(true);
      } else if (message.data.type === "EXTENSION_RESOURCE_URLS") {
        console.log("Received extension resource URLs", message.data);
        setResourceUrls(message.data.data);
      }
    };

    window.addEventListener("message", listener);

    sendRequestFromViewToContent({ type: "GET_EXTENSION_RESOURCES" });

    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  const sendRequestFromViewToContent = (request: RequestFromViewToContent) => {
    console.log("Sending request from view to content", request);
    window.postMessage(request, "*");
  };

  const fetchName = () => {
    sendRequestFromViewToContent({ type: "GET_USER_INFO" });
  };

  const toggleOverlay = () => {
    if (!isOpen) {
      fetchName();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="dummy-extension-overlay">
      <button
        onClick={toggleOverlay}
        className="profile-button"
        aria-label="Toggle profile"
      >
        <img src={profileIcon} alt="Profile" />
      </button>

      {isOpen && (
        <div className="profile-overlay">
          <div className="overlay-header">
            <h3>User Profile</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="close-button"
              aria-label="Close profile"
            >
              ✕
            </button>
          </div>

          <div className="overlay-content">
            {userInfo ? (
              <div className="user-info">
                <img
                  src={profileIcon}
                  alt="Profile"
                  className="profile-avatar"
                />
                <p className="user-name">{userInfo}</p>
                {resourceUrls.xxlImage && (
                  <img
                    src={resourceUrls.xxlImage}
                    alt="xxl"
                    className="xxl-image"
                  />
                )}
              </div>
            ) : (
              <div className="loading-state">
                <p>No user information available</p>
                <button onClick={fetchName} className="fetch-button">
                  Fetch Profile
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
