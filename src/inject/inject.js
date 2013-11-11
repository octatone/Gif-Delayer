/* global $ */
'use strict';

function getGifs () {

  var gifs = [];
  var images = document.getElementsByTagName('img');
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

  var isLoaded = false;
  var url = gif.src;
  var image = new Image();
  var $loading = $('<div class="gif-loading">Loading yer gif ...</div>');

  var $gif = $(gif);

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

function loadGifs () {

  var gifs = getGifs();
  console.log('loadGifs', gifs.length);
  for (var i=0, len=gifs.length; i<len; i++) {
    loadGif(gifs[i]);
  }
}

loadGifs();