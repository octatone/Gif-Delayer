Gif-Delayer
===========

A chrome extension that hide gifs until they are fully loaded, for optimal gif enjoyment.

https://chrome.google.com/webstore/detail/gif-delayer/cmfcdkambpljcndgdmaccaagladfnepa

Change Log
==========

0.1.2
- add whitelist of sites to disable this extension on certain sites using chrome options V2

0.0.8
- fix bug overriding default gif styling on certain websites (thanks to [Marc Cornellà](https://github.com/mcornella))

0.0.7
- fix bug preventing gifs from loading on Wolfram Alpha

0.0.6
- more efficient loading hooks
- remove cruft from package (moving common code to submodule for FF/Safari releases)

0.0.5
- added css spinner to loading text
- remove absolute positioning from loading text

0.0.4
- show gif if any errors
- clean up code
- log messages to console
- use all_urls for injection matching

0.0.3
 - Tracks loaded and loading gifs to reduce duplicate resource requests if gif already cached for the page
 - Should not hide buttons in GMail - not working 100%, sometimes navigation buttons still hidden until you hover them, or scroll the page

0.0.2
 - Handle gifs added to the DOM after initial load properly.
 - Works with Hover Zoom
