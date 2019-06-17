if (module.hot) {
  module.hot.accept()
}

import './app.scss';
import './custom.scss';
import AMF from 'amf-js';
var $ = require('jQuery');
import { setupScreen, interuptDeserialize, currentByteLenght } from './uploader';
var upload = require('./uploader');
export var addLibrary = $("#addLibrary");
export var addFiles = $("#addFiles");
export var addLibraryInput = $("#addLibraryInput");
export var addFilesInput = $("#addFilesInput");
export var listATSV = $("#listATSV");
export var libraryTitle = $("#libraryTitle");
export var chapterTitle = $("#chapterTitle");
export var chaptersList = $("#chaptersList");
export var flashReport = $("#flashReport");

export var libraryExpanded = true;
export var chapterExpanded = true;
export var localeValues = null;
export var defaultLocale = null;

export var header = { 
  "Access-Control-Allow-Origin" : "*",
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT'
};

var loc = window.location.pathname;
var serverDir = loc.substring(0, loc.lastIndexOf('/'));

const img2 = $('<div id="logo">');
flashReport.append(img2);

//#region localization
getLocalization();

export function replaceLocal(token) {
  if(localeValues == null) return "";
  var domElement = $('span[name='+token.name+']');
  var localValue = localeValues.find(_ => _.name == token.name);
  if(localValue) {
    if(domElement.length > 0) {
      domElement.replaceWith(localValue.value);
      return;
    }
    return localValue.value;
  }
  return "";
}

export async function getLocalization() {
  await $.ajax({
    type: "GET",
    url: serverDir + '/locales/locale.json',
    data: {},
    crossDomain:true,
    headers: header,
    success: function(data) {
      defaultLocale = data.defaultLocale;
      return getLocalizationValues(defaultLocale);
    }
  }); 
}

export async function getLocalizationValues(locale) {
  await $.ajax({
    type: "GET",
    url: serverDir + '/locales/'+locale+'.txt',
    data: {},
    crossDomain:true,
    headers: header,
    success: function(data) {
      var values = [];
      data = data.split("\n");
      for (let index = 0; index < data.length; index++) {
        const val = data[index];
        var keyValuePair = val.split("=");
        if(keyValuePair.length == 2) {
          values.push({ name: keyValuePair[0], value: keyValuePair[1]})
        }
      }
      localeValues = values;
      setupLocalization();
    }
  }); 
}

export async function setupLocalization() {
  if(localeValues == null) return;
  for (let index = 0; index < localeValues.length; index++) {
    const token = localeValues[index];
    replaceLocal(token);
  }
}
//#endregion

//#region setup click events
libraryTitle.on("click", function(event) {
  event.stopPropagation();
  listATSV.children('ul').slideToggle(200);
  libraryExpanded = !libraryExpanded;
  if(libraryExpanded) {
    $("#libraryTitleCaret").removeClass("fa-caret-right").addClass("fa-caret-down");
  } else {
    $("#libraryTitleCaret").removeClass("fa-caret-down").addClass("fa-caret-right");
  }
});

chapterTitle.on("click", function(event) {
  event.stopImmediatePropagation();
  $('.chapterNode').slideToggle(200);
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
//#endregion

export function uploadFiles(event) {
  let files = event.target.files;
  var folders = $("#defaultFolder").length;

  if(folders == 0) {
    //creation d'un dossier défaut 
    var ulFolder = $("<ul id='defaultFolder'><i class='fas fa-folder-open'></i><p>"+replaceLocal({ name: "LOCALFOLDER"})+"</p></li>");
    listATSV.append(ulFolder);
    ulFolder.on("click", function(event) {
      event.stopPropagation();
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
      if(fileName.length > 45) {
        fileName = fileName.substring(0,40) + " ...";
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
  $.ajax({
    type: "GET",
    url: serverDir + '/library.json',
    data: {},
    crossDomain:true,
    headers: header,
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
      event.stopPropagation();
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
      if(fileName.length > 45) {
        fileName = fileName.substring(0,40) + " ...";
      }
      var item = $("<li class='atsvList'><i class='fas fa-film'></i><p>"+ fileName +"</p></li>");
      item.attr("url", url);
      item.on("click", function(e) {
        e.stopPropagation();
        $(".atsvList > p").removeClass("bolder");
        chapterExpanded = true;
        e.target.classList.add("bolder");
        url = e.target.parentNode.getAttribute("url");
        if(url) {
          if(url.startsWith("./") || url.startsWith("/")) {
            url = serverDir + url.replace('./','/')
          }
          getFile(url);
        }

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
  $("#progress").remove();
  var parent = $(".bolder").parent();
  parent.append("<div id='progress' class='progress' value='0'></div><div id='loadingLabel'>"+ replaceLocal({ name: "LOADING"}) +"</div>");
  var progressBar = $("#progress");
  var loadingLabel = $("#loadingLabel");
  $.ajax({
    xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                progressBar.css({
                    width: percentComplete * 100 + '%'
                });
                if(percentComplete == 1) {
                  loadingLabel.remove();
                  progressBar.remove();
                }
            }
        }, false);
        return xhr;
      },
      type: "GET",
      url: url,
      data: {},
      crossDomain:true,
      xhrFields: {
        responseType: 'arraybuffer',
      },
      headers: header,
      crossDomain: true,
      success: function (data) {
        var encodedData = new AMF.Deserializer(data);
        var byteLength = encodedData.buf.byteLength;
        upload.repeat(encodedData, byteLength);
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