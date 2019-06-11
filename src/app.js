if (module.hot) {
  module.hot.accept()
}

import './app.scss';
import './custom.scss';
import './images';
var $ = require('jQuery');
import { setupScreen } from './uploader';

//$('head').append('<link rel="stylesheet" type="text/css" href="./webfonts/font.css">');

$('#uploader').on('change', function() {
  import("./uploader").then(upload => {
    upload.openfile()
  })
});

setupScreen();