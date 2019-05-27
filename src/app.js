if (module.hot) {
  module.hot.accept()
}

import './app.scss'

var uploader = document.getElementById('uploader');
uploader.onchange = () => {
  import("./uploader").then(upload => {
    upload.openfile()
  })
}