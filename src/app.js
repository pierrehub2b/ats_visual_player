if (module.hot) {
  module.hot.accept()
}

import './app.scss';
import { setupScreen } from './uploader';
//import './images'

// tl.from("#hero", 0.5, {scale:0.2, opacity:0, ease:Back.easeOut, transformOrigin:"50% 50%"})
//   .from("#greensock", 0.5, {yPercent:115, ease:Back.easeOut}, "greensock")
//   .staggerFrom("#tagline g", 0.3, {y:-40, opacity:0}, 0.1, "-=0.2");

var uploader = document.getElementById('uploader');
uploader.onchange = () => {
  import("./uploader").then(upload => {
    upload.openfile()
  })
}

setupScreen();