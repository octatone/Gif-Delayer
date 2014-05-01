'use strict';

var fileSizes = {};
var sizeRequests = {};

function getReadableFileSizeString (fileSizeInBytes) {

  var i = -1;
  var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
    fileSizeInBytes = fileSizeInBytes / 1024;
    i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

chrome.webRequest.onHeadersReceived.addListener(function (details) {

  var contentLength;
  details.responseHeaders.forEach(function (header) {

    if (header.name === 'Content-Length') {
      contentLength = header.value;
    }
  });

  if (contentLength !== undefined) {
    contentLength = getReadableFileSizeString(contentLength);
    fileSizes[details.url] = contentLength;
  }

  console.log('onHeadersReceived', details.url, fileSizes[details.url]);

  var sendResponse = sizeRequests[details.url];
  console.log(sendResponse);
  if (sendResponse) {
    sendResponse(fileSizes[details.url]);
  }
},
{
  'urls': ['*://*/*gif']
},
['responseHeaders']
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  var fileSize;
  if (request.url) {
    fileSize = fileSizes[request.url];
  }

  console.log('onMessage', request.url, fileSizes[request.url]);

  if (!fileSize) {
    sizeRequests[request.url] = function (size) {

      sendResponse({'size': size});
    };
  }
  else {
    sendResponse({'size': fileSize});
  }
});