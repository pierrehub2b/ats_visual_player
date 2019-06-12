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
const fs = require('fs');
var directory = './ATSV';

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

// fs.readdir(directory, function (err, files) {
//   //handling error
//   if (err) {
//       return console.log('Unable to scan directory: ' + err);
//   } 
//   //listing all files using forEach
//   files.forEach(function (file) {
//       // Do whatever you want to do with the file
//       for (let i=0; i<files.length; i++) {
//         if(files[i].type == "application/ats.action-test-script.visual-report") {
//           var fileName = files[i].name;
//           // if(fileName.length > 35) {
//           //   fileName = fileName.substring(0, 30) + "...";
//           // }
          
//           var item = $("<li class='atsvList'><i class='fas fa-file-video'></i><p>"+ fileName +"</p></li>");
//           item.on("click", function(e) {
//             $(".atsvList > p").removeClass("bolder");
//             e.target.classList.add("bolder");
//             upload.openfile(files[i]);
//           });
//           listing.append(item);
//         }
//       };
//   });
// });

setupScreen();