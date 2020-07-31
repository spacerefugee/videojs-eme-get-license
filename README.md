# videojs-eme-get-license

Samples of 'getLicense' function of [videojs-contrib-eme](https://github.com/videojs/videojs-contrib-eme#initialization), refer to document of shaka-player([License Server Authentication](https://shaka-player-demo.appspot.com/docs/api/tutorial-license-server-auth.html), [License Wrapping](https://shaka-player-demo.appspot.com/docs/api/tutorial-license-wrapping.html)).

## License Server Authentication

Example:

``` javascript
player.src({
    src: '<your url here>',
    type: 'application/dash+xml',
    keySystems: {
        'com.widevine.alpha': '<YOUR URL HERE>',
        'com.microsoft.playready': '<YOUR_KEY_URL>'
	}
});
```

## Header authentication

Here are some header authentication cases:[plblic-test-vectors](https://github.com/Axinom/public-test-vectors#usage-of-axinom-drm):

PlayReady license server URL: https://drm-playready-licensing.axtest.net/AcquireLicense

Widevine license server URL: https://drm-widevine-licensing.axtest.net/AcquireLicense

Stream for testing: [v7-MultiDRM-SingleKey](https://github.com/Axinom/public-test-vectors#v7-multidrm-singlekey) [1080p variant](https://media.axprod.net/TestVectors/v7-MultiDRM-SingleKey/Manifest_1080p.mpd)

Value to use for X-AxDRM-Message header: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiYjMzNjRlYjUtNTFmNi00YWUzLThjOTgtMzNjZWQ1ZTMxYzc4IiwibWVzc2FnZSI6eyJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsImtleXMiOlt7ImlkIjoiOWViNDA1MGQtZTQ0Yi00ODAyLTkzMmUtMjdkNzUwODNlMjY2IiwiZW5jcnlwdGVkX2tleSI6ImxLM09qSExZVzI0Y3Iya3RSNzRmbnc9PSJ9XX19.4lWwW46k-oWcah8oN18LPj5OLS5ZU-_AQv7fe0JhNjA`

Example:

```javascript
player.src({
    src: 'https://media.axprod.net/TestVectors/v7-MultiDRM-SingleKey/Manifest_1080p.mpd',
    type: 'application/dash+xml',
    keySystems: {
        "com.microsoft.playready": {
            url: 'https://drm-playready-licensing.axtest.net/AcquireLicense',
            licenseHeaders: {
                'X-AxDRM-Message': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiYjMzNjRlYjUtNTFmNi00YWUzLThjOTgtMzNjZWQ1ZTMxYzc4IiwibWVzc2FnZSI6eyJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsImtleXMiOlt7ImlkIjoiOWViNDA1MGQtZTQ0Yi00ODAyLTkzMmUtMjdkNzUwODNlMjY2IiwiZW5jcnlwdGVkX2tleSI6ImxLM09qSExZVzI0Y3Iya3RSNzRmbnc9PSJ9XX19.4lWwW46k-oWcah8oN18LPj5OLS5ZU-_AQv7fe0JhNjA'
            }
        },
        "com.widevine.alpha": {
            url: 'https://drm-widevine-licensing.axtest.net/AcquireLicense',
            licenseHeaders: {
                'X-AxDRM-Message': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiYjMzNjRlYjUtNTFmNi00YWUzLThjOTgtMzNjZWQ1ZTMxYzc4IiwibWVzc2FnZSI6eyJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsImtleXMiOlt7ImlkIjoiOWViNDA1MGQtZTQ0Yi00ODAyLTkzMmUtMjdkNzUwODNlMjY2IiwiZW5jcnlwdGVkX2tleSI6ImxLM09qSExZVzI0Y3Iya3RSNzRmbnc9PSJ9XX19.4lWwW46k-oWcah8oN18LPj5OLS5ZU-_AQv7fe0JhNjA'
            }
        }
    }
});

```

## Parameter Authentication



## Wrapping License Requests

```javascript
 
 player.src({
     src: '<your url here>',
     type: 'application/dash+xml',
     keySystems: {
         "com.microsoft.playready": {
             getLicense: (emeOptions, keyMessage, callback) => {
                 let messageContents = getMessageContents(keyMessage);
                 let message = messageContents.message;
                 let headers = mergeAndRemoveNull(messageContents.headers, emeOptions.emeHeaders);
                 message = wrapMessage(stringToUint8Array(message), this.drmToken);
                 licenseCallback('PlayReady license server URL', headers, message, callback);
             }
         },
         "com.widevine.alpha": {
             getLicense: (emeOptions, keyMessage, callback) => {
                 let headers = mergeAndRemoveNull({ "Content-type": "application/octet-stream" }, emeOptions.emeHeaders);
                 keyMessage = wrapMessage(keyMessage, this.drmToken);
                 licenseCallback('Widevine license server URL', headers, keyMessage, callback);
             }
         }
     }
 });
```
