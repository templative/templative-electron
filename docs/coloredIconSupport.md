Inkscape does not support multicolored icons.
Resvg rust does, but js does not.
https://github.com/thx/resvg-js/issues/316
https://github.com/linebender/resvg/issues/487
https://github.com/linebender/resvg/pull/735

Creating single color fonts
https://icomoon.io/app/#/select/font
https://www.youtube.com/watch?v=ZTDQKQRTQbY&ab_channel=MichelleTheCreator

https://www.npmjs.com/package/webfont


sumbol use is does not work with text.
https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/symbol
https://www.w3.org/TR/SVG/struct.html#UseEventHandling

node ./src/main/templative/cli.js iconfont --input "./scripts/data/stuff" --output "./scripts/data/stuff" --name "multicolored"
install the font
use the font-family and the correct unicode to display the icon
