if (module.hot) {
  module.hot.accept()
}

import './app.scss';
import './custom.scss';
import './images';
import AMF from 'amf-js';
var $ = require('jQuery');
import { setupScreen } from './uploader';
var upload = require('./uploader');
export var addLibrary = $("#addLibrary");
export var addFiles = $("#addFiles");
export var addLibraryInput = $("#addLibraryInput");
export var addFilesInput = $("#addFilesInput");
export var listATSV = $("#listATSV");
export var libraryTitle = $("#libraryTitle");
export var chapterTitle = $("#chapterTitle");
export var chaptersList = $("#chaptersList");

export var libraryExpanded = true;
export var chapterExpanded = true;

libraryTitle.on("click", function() {
  listATSV.children('ul').slideToggle(200);
  libraryExpanded = !libraryExpanded;
  if(libraryExpanded) {
    $("#libraryTitleCaret").removeClass("fa-caret-right").addClass("fa-caret-down");
  } else {
    $("#libraryTitleCaret").removeClass("fa-caret-down").addClass("fa-caret-right");
  }
});

chapterTitle.on("click", function() {
  $('.chapterNode').slideToggle(200);
  $('#output').slideToggle(200);
  chapterExpanded = !chapterExpanded;
  if(chapterExpanded) {
    $("#chapterTitleCaret").removeClass("fa-caret-right").addClass("fa-caret-down");
  } else {
    $("#chapterTitleCaret").removeClass("fa-caret-down").addClass("fa-caret-right");
  }
});

addLibrary.click(function () {
  addLibraryInput.click();
});

addFiles.click(function () {
  addFilesInput.click();
});

export function uploadFiles(event) {
  let files = event.target.files;
  var folders = $("#defaultFolder").length;

  if(folders == 0) {
    //creation d'un dossier défaut 
    var ulFolder = $("<ul id='defaultFolder'><i class='fas fa-folder-open'></i><p>Dossier local</p></li>");
    listATSV.append(ulFolder);
    ulFolder.on("click", function(event) {
      var elem = $("#" + event.target.parentNode.id);
      elem.children('.atsvList').slideToggle(200);
      elem.children('#chapterContainer').slideToggle(200);
      var iElem = elem.children('i')[0];
      if(iElem.classList.contains("fa-folder-open")) {
        iElem.classList.remove("fa-folder-open");
        iElem.classList.add("fa-folder");
      } else {
        iElem.classList.remove("fa-folder")
        iElem.classList.add("fa-folder-open")
      }
    });
  }

  var folder = $("#defaultFolder");

  for (let i=0; i<files.length; i++) {
    if(files[i].type == "application/ats.action-test-script.visual-report") {
      var fileName = files[i].name;
      if(fileName.length > 35) {
        fileName = fileName.substring(0, 30) + "...";
      }  
      
      var item = $("<li class='atsvList'><i class='fas fa-film'></i><p>"+ fileName +"</p></li>");
      item.on("click", function(e) {
        $(".atsvList > p").removeClass("bolder");
        e.target.classList.add("bolder");
        upload.openfile(files[i]);
        chapterExpanded = true;
      });
      folder.append(item);
    }
  };
}

export function importLibrary(event) {
  let file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(file);
}

export function readLocalJSON() {
  var loc = window.location.pathname;
  var serverDir = loc.substring(0, loc.lastIndexOf('/'));
  $.ajax({
    type: "GET",
    url: serverDir + '/library.json',
    data: {},
    crossDomain:true,
    headers: { 
      "Access-Control-Allow-Origin" : "*",
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    success: function(data) {
      JsonTraitment(data);
    }
  });
}

export function JsonTraitment(obj) {
  for (let i = 0; i < obj.folders.length; i++) {
    const folder = obj.folders[i];
    var name = folder.name;
    var ulFolder = $("<ul id='"+name.replace(/ /g, '')+"'><i class='fas fa-folder-open'></i><p>"+name+"</p></li>");
    listATSV.append(ulFolder);
    var currentFolder = $("#"+name.replace(/ /g, ''));
    currentFolder.on("click", function(event) {
      var elem = $("#" + event.target.parentNode.id);
      elem.children('.atsvList').slideToggle(200);
      elem.children('#chapterContainer').slideToggle(200);
      var iElem = elem.children('i')[0];
      if(iElem.classList.contains("fa-folder-open")) {
        iElem.classList.remove("fa-folder-open");
        iElem.classList.add("fa-folder");
      } else {
        iElem.classList.remove("fa-folder")
        iElem.classList.add("fa-folder-open")
      }
    });
    var urls = folder.urls;
    for (let index = 0; index < urls.length; index++) {
      const url = urls[index];
      url = url.replace(/\\/g, '/');
      const table = url.split("/");
      const fileName = table[table.length-1];
      var item = $("<li class='atsvList'><i class='fas fa-film'></i><p>"+ fileName +"</p></li>");
      item.attr("url", url);
      item.on("click", function(e) {
        $(".atsvList > p").removeClass("bolder");
        chapterExpanded = true;
        e.target.classList.add("bolder");
        url = e.target.parentNode.getAttribute("url");
        if(url.startWidth("./") || url.startWidth("/")) {
          var loc = window.location.pathname;
          var serverDir = loc.substring(0, loc.lastIndexOf('/'));
          url = serverDir + url.replace('./','/')
        }
        getFile(url);
        e.stopPropagation();
      });
      currentFolder.append(item);
    }
  }
}

export async function onReaderLoad(event){
  var obj = JSON.parse(event.target.result);
  JsonTraitment(obj);
}

export function getFile(url) {
  upload.openfile(null);
  $.ajax({
    type: "GET",
    url: url,
    data: {},
    crossDomain:true,
    xhrFields: {
      responseType: 'arraybuffer',
    },
    headers: { 
      "Access-Control-Allow-Origin" : "*",
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    success: function(data) {
      var encodedData = new AMF.Deserializer(data);
      upload.repeat(encodedData);
    }
  });
}

addLibraryInput.on('change',function (event)
{
    importLibrary(event)
});
addFilesInput.on("change", uploadFiles);

setupScreen();
readLocalJSON();