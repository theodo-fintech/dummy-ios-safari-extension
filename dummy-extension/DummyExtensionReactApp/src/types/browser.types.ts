import type * as Browser from "webextension-polyfill";

declare global {
  const browser: Browser.Browser;
}
