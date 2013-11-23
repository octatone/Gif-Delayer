/* global $ */
'use strict';

var _loadedURLS = {};
var _loadingURLS = {};
var _logPrefix = '[GIF DELAYER] - ';

function log (string, e) {
  e = e || '';
  console.log(_logPrefix + string, e);
}

function warn (string, e) {
  e = e || '';
  console.warn(_logPrefix + string, e);
}

function isResolved (deferred) {

  return deferred.state() === 'resolved';
}

function getGifs (context) {

  var gifs = [];
  var images = $('img', context).not('.gif-delayer-loaded').add($(context).filter('img').not('.gif-delayer-loaded'));

  var image;
  for (var i=0, len=images.length; i < len; i++) {
    image = images[i];
    if (/\.gif/.test(image.src)) {
      gifs.push(image);
    }
  }

  return gifs;
}

function loadGif (gif) {

  var url = gif.src;
  var $loading = $('<div class="gif-delayer-loading">Loading yer gif </div>');
  var $gif = $(gif).addClass('gif-delayer');

  function loaded () {
    $loading.remove();
    $gif.addClass('gif-delayer-loaded');
  }

  if (!_loadedURLS[url] && !_loadingURLS[url]) {

    log('load starting for ' + url);

    var deferred = _loadingURLS[url] = new $.Deferred();

    $gif.before($loading);
    var image = new Image();

    image.addEventListener('load', function () {

      if (!isResolved(deferred)) {
        log('load completed, resolving ' + url);
        deferred.resolve();
      }
    });
    
    image.addEventListener('abort', function (e) {

      if (!isResolved(deferred)) {
        warn('load aborted, resolving ' + url, e);
        deferred.resolve();
      }
    });
    
    image.addEventListener('error', function (e) {
      
      if (!isResolved(deferred)) {
        warn('load errored, resolving ' + url, e);
        deferred.resolve();
      }
    });
    
    image.src = url;
    
    if (image.complete) {
      if (!isResolved(deferred)) {
        log('already cached, resolving ' + url);
        deferred.resolve();
      }
    }
  }

  $.when(_loadingURLS[url]).then(function () {
    
    log('deferred resolved, reveailing gif(s) ' + url);
    _loadedURLS[url] = true;
    loaded();
  });
}

function loadGifs (context) {

  var gifs = getGifs(context);
  // gifs.length && console.log('loadGifs', gifs.length);
  for (var i=0, len=gifs.length; i<len; i++) {
    loadGif(gifs[i]);
  }
}

function observe () {

  // select the target node
  var target = document.body;
   
  // create an observer instance
  var observer = new MutationObserver(function (mutations) {

    var node;
    mutations.forEach(function (mutation) {
    
      if (mutation.addedNodes && mutation.addedNodes.length) {

        for (var i=0, len=mutation.addedNodes.length; i<len; i++) {
          node = mutation.addedNodes[i];
          loadGifs(node);
        }
      }
      else if (mutation.attributeName === 'class' || mutation.attributeName === 'src'){

        if (!$(mutation.target).hasClass('gif-delayer')) {
          loadGifs(mutation.target);
        }
      }
    });
  });
   
  // configuration of the observer:
  var config = {

    'childList': true, // Set to true if mutations to target's children are to be observed.
    'attributes': true, // Set to true if mutations to target's attributes are to be observed.
    // characterData Set to true if mutations to target's data are to be observed.
    'subtree': true, // Set to true if mutations to not just target, but also target's descendants are to be observed.
    // attributeOldValue Set to true if attributes is set to true and target's attribute value before the mutation needs to be recorded.
    // characterDataOldValue Set to true if characterData is set to true and target's data before the mutation needs to be recorded.
    // attributeFilter
  };
   
  // pass in the target node, as well as the observer options
  observer.observe(target, config);
}

loadGifs(document.body);

$(observe);
