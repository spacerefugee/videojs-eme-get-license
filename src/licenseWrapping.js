import videojs from "video.js";
import "videojs-contrib-eme";
import { getMessageContents } from "videojs-contrib-eme/src/playready.js";
import { mergeAndRemoveNull } from "videojs-contrib-eme/src/utils.js";

function stringToUint8Array(str) {
  var arr = [];
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }

  var tmpUint8Array = new Uint8Array(arr);
  return tmpUint8Array;
}

function arrayBufferToString(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function licenseCallback(uri, headers, body, callback) {
  videojs.xhr(
    {
      uri,
      method: "POST",
      responseType: "arraybuffer",
      body: body,
      headers: headers
    },
    function (err, response, responseBody) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, responseBody);
    }
  );
}

/**
 * @param {ArrayBuffer} message
 * @param {string} drmToken
 */
function wrapMessage(message) {
  // Create the wrapped request structure.
  const wrapped = {};

  // Encode the raw license request in base64.
  wrapped.rawLicenseRequestBase64 = btoa(arrayBufferToString(message));

  // Add whatever else we want to communicate to the server.
  // In practice, you would send what the server needs and the server would
  // react to it.
  wrapped.favoriteColor = "blue";
  wrapped.Beatles = ["John", "Paul", "George", "Ringo"];
  wrapped.bestBeatleIndex = 1; // Paul, of course.
  wrapped.pEqualsNP = false; // maybe?

  // Encode the wrapped request as JSON.
  const wrappedJson = JSON.stringify(wrapped);

  // Convert the JSON string back into an ArrayBuffer
  return stringToUint8Array(wrappedJson).buffer;
}

player.src({
  src: "<your url here>",
  type: "application/dash+xml",
  keySystems: {
    "com.microsoft.playready": {
      getLicense: (emeOptions, keyMessage, callback) => {
        let messageContents = getMessageContents(keyMessage);
        let message = messageContents.message;
        let headers = mergeAndRemoveNull(messageContents.headers, emeOptions.emeHeaders);
        message = wrapMessage(stringToUint8Array(message));
        licenseCallback("PlayReady license server URL", headers, message, callback);
      }
    },
    "com.widevine.alpha": {
      getLicense: (emeOptions, keyMessage, callback) => {
        let headers = mergeAndRemoveNull({ "Content-type": "application/octet-stream" }, emeOptions.emeHeaders);
        keyMessage = wrapMessage(keyMessage);
        licenseCallback("Widevine license server URL", headers, keyMessage, callback);
      }
    }
  }
});
