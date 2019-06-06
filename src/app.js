if (module.hot) {
  module.hot.accept()
}

import './app.scss';
import './custom.scss';
var $ = require('jQuery');
import { setupScreen } from './uploader';

import './images'

$('#uploader').on('change', function() {
  import("./uploader").then(upload => {
    upload.openfile()
  })
});

setupScreen();