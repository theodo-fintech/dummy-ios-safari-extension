(() => {
const n=e=>(console.log("Received response from App to background",e),e),t=e=>(console.log("Sending request from background to application",e),browser.runtime.sendNativeMessage("dummy-extension",e));browser.runtime.onMessage.addListener(e=>{const o=e;if(o.type==="GET_USER_INFO")return console.log("Received request from content to background",o),t({type:"GET_USER_INFO"}).then(n)});

})()