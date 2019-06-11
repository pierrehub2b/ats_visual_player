if (module.hot) {
  module.hot.accept()
}

import './app.scss';
import './custom.scss';
import './images';
var $ = require('jQuery');
import { setupScreen } from './uploader';
var upload = require('./uploader');
export var input = $("#uploader");
import fs from 'fs';
var directory = './ATSV';


//$('head').append('<link rel="stylesheet" type="text/css" href="./webfonts/font.css">');

export function filesTraitment(files) {
  
}

input.on("change", function(event) {
  let listing = $("#listing");
  listing.html("");
  let files = event.target.files;

  for (let i=0; i<files.length; i++) {
    if(files[i].type == "application/ats.action-test-script.visual-report") {
      var fileName = files[i].name;
      // if(fileName.length > 35) {
      //   fileName = fileName.substring(0, 30) + "...";
      // }
      
      var item = $("<li class='atsvList'><i class='fas fa-file-video'></i><p>"+ fileName +"</p></li>");
      item.on("click", function(e) {
        $(".atsvList > p").removeClass("bolder");
        e.target.classList.add("bolder");
        upload.openfile(files[i]);
      });
      listing.append(item);
    }
  };
});

// fs.readdir(directory, (err, files) => {
// 	if(err) {
// 		// handle error; e.g., folder didn't exist
// 	}
//   // 'files' is an array of the files found in the directory
//   filesTraitment();
// });

setupScreen();