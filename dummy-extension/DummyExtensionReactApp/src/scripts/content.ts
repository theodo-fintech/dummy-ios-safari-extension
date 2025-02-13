import browser from "webextension-polyfill";

console.log("Hello from content script!");

const root = document.createElement("div");
root.id = "dummy-extension-root";
document.body.insertAdjacentElement("afterend", root);

const script = document.createElement("script");
script.src = browser.runtime.getURL("main.bundle.js");
script.type = "module";
document.head.appendChild(script);
