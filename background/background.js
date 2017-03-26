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

  console.debug('Content-Length', contentLength);

  if (contentLength !== undefined) {
    contentLength = getReadableFileSizeString(contentLength);
    fileSizes[details.url] = contentLength;
  }

  console.log('onHeadersReceived', details.url, fileSizes[details.url]);

  var sendResponse = sizeRequests[details.url];
  if (sendResponse) {
    console.debug('send response callback', fileSizes[details.url]);
    sendResponse(fileSizes[details.url]);
  }
},
{
  'urls': ['*://*/*gif'],
  'types': ['image']
},
['responseHeaders']
);

function handleSizePorts (port) {

  port.onMessage.addListener(function (msg) {

    var fileSize;
    if (msg.url) {
      fileSize = fileSizes[msg.url];
    }

    console.log('onMessage background', msg.url, fileSizes[msg.url]);

    if (!fileSize) {
      sizeRequests[msg.url] = function (size) {

        port.postMessage({
          'url': msg.url,
          'size': size
        });
      };
    }
    else {
      port.postMessage({
        'url': msg.url,
        'size': fileSize
      });
    }
  });
}

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'size') {
    handleSizePorts(port);
  }
});

//ZH Addition to check whitelist before loading any gifs
function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }
    //find & remove port number & remove 'www.'
    domain = domain.split(':')[0].replace('www.','');
    return domain;
}

// listener, updates url on change
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url != undefined) {
    chrome.storage.sync.get("whitelist", function(items) {
      // whitelist > array, return whether current domain matches whitelist
      var inWhitelist = items.whitelist.split('\n').some(
        site => extractDomain(site) === extractDomain(changeInfo.url));
      if(!inWhitelist) {
        chrome.tabs.executeScript(null, {file: "src/inject/inject.js"});
        chrome.tabs.insertCSS(null, {file: "src/inject/inject.css"});
      }
    });
  }
});
