/* global $ */
'use strict';

function getGifs (context) {

  var gifs = [];
  var images = $('img', context).not('.loaded').add($(context).filter('img').not('.loaded'));

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

  console.log('loadGif');

  var isLoaded = false;
  var url = gif.src;
  var image = new Image();
  var $loading = $('<div class="gif-loading">Loading yer gif ...</div>');

  var $gif = $(gif).addClass('gif-delayer');

  function loaded () {

    if (!isLoaded) {
      console.log('#loaded');
      isLoaded = true;
      $loading.remove();
      $gif.addClass('loaded');
    }
  }

  $gif.after($loading);

  image.addEventListener('load', loaded);
  image.src = url;
  if (image.complete) {
    loaded();
  }
}

function loadGifs (context) {

  var gifs = getGifs(context);
  gifs.length && console.log('loadGifs', gifs.length);
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
    
      if (mutation.addedNodes) {
        for (var i=0, len=mutation.addedNodes.length; i<len; i++) {
          node = mutation.addedNodes[i];
          loadGifs(node);
        }
      }
    });
  });
   
  // configuration of the observer:
  var config = {

    'childList': true, //Set to true if mutations to target's children are to be observed.
    // attributes  Set to true if mutations to target's attributes are to be observed.
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
