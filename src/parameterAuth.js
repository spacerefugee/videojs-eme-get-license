import videojs from "video.js";
import "videojs-contrib-eme";
import { getMessageContents } from "videojs-contrib-eme/src/playready.js";
import { mergeAndRemoveNull } from "videojs-contrib-eme/src/utils.js";

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
 * @param {string} uri
 */
function appendParam(uri) {
  // This is the specific parameter name and value the server wants:
  return (uri += "?CWIP-Auth-Param=VGhpc0lzQVRlc3QK");
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
        let uri = appendParam("<PLAYREADY_LICENSE_URL>");
        licenseCallback(uri, headers, message, callback);
      }
    },
    "com.widevine.alpha": {
      getLicense: (emeOptions, keyMessage, callback) => {
        let headers = mergeAndRemoveNull({ "Content-type": "application/octet-stream" }, emeOptions.emeHeaders);
        let uri = appendParam("<WIDEVINE_LICENSE_URL>");
        licenseCallback(uri, headers, keyMessage, callback);
      }
    }
  }
});
