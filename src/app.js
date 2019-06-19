if (module.hot) {
  module.hot.accept()
}

import './app.scss';
import './custom.scss';
import AMF from 'amf-js';
var $ = require('jQuery');
import { setupScreen, interuptDeserialize, currentUID, create_UUID } from './uploader';
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
export var localeValues = null;
export var defaultLocale = null;
export var jsonLibraryUrl = '/library.json';
export var header = { 
  "Access-Control-Allow-Origin" : "*",
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT'
};

var loc = window.location.pathname;
var serverDir = loc.substring(0, loc.lastIndexOf('/'));

const img2 = $('<div id="logo">');
flashReport.append(img2);

export async function setupSettings() {
  await $.ajax({
    type: "GET",
    url: serverDir + '/settings.txt',
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
      for (let index = 0; index < values.length; index++) {
        const v = values[index];
        switch(v.name) {
          case 'IMGWATERMARK':
            $("#watermarkImg").attr("src", v.value);
            break;
          case 'URLWATERMARK':
            $("#watermarklink").attr("href", v.value);
            break;
          case 'IMGBACKGROUND':
            $("#screenBackground").css("background-image", 'url('+v.value+')')
            break;
          case 'ATSVLIBRARY':
            jsonLibraryUrl = v.value;
            break;
        }
      }
    }
  }); 
}

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
    if(token.name == "WATERMARK") {
      $("#watermarkTxt").append(token.value);
      continue;
    }
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

addLibrary.click(function (event) {
  event.stopPropagation();
  addLibraryInput.click();
});

addFiles.click(function (event) {
  event.stopPropagation();
  addFilesInput.click();
});
//#endregion

export function uploadFiles(event) {
  let files = event.target.files;
  var folders = $("#defaultFolder").length;

  if(folders == 0) {
    //creation d'un dossier défaut 
    var ulFolder = $("<ul id='defaultFolder'><i class='fas fa-folder-open'></i><p>"+replaceLocal({ name: "LOCALFOLDER"})+"</p><div></div></ul>");
    listATSV.append(ulFolder);
    ulFolder.on("click", function(event) {
      event.stopPropagation();
      var elem = $("#" + event.target.parentNode.id);
      elem.children('div').slideToggle(200);
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
      // if(fileName.length > 45) {
      //   fileName = fileName.substring(0,40) + " ...";
      // }
      
      var item = $("<i class='fas fa-film'></i><li class='atsvList'><p>"+ fileName +"</p></li>");
      item.on("click", function(event) {
        event.stopPropagation();
        $(".atsvList > p").removeClass("bolder");
        event.target.classList.add("bolder");
        upload.openfile(files[i]);
      });
      folder.children('div').append(item);
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
    url: serverDir + jsonLibraryUrl,
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
    var ulFolder = $("<ul id='"+name.replace(/ /g, '')+"'><i class='fas fa-folder-open'></i><p>"+name+"</p><div></div></ul>");
    listATSV.append(ulFolder);
    var currentFolder = $("#"+name.replace(/ /g, ''));
    currentFolder.on("click", function(event) {
      event.stopPropagation();
      var elem = $("#" + event.target.parentNode.id);
      elem.children('div').slideToggle(200);
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
      // if(fileName.length > 45) {
      //   fileName = fileName.substring(0,40) + " ...";
      // }
      var item = $("<i class='fas fa-film'></i><li class='atsvList'><p>"+ fileName +"</p></li>");
      item.attr("url", url);
      item.on("click", function(event) {
        event.stopPropagation();
        $(".atsvList > p").removeClass("bolder");
        event.target.classList.add("bolder");
        url = event.target.parentNode.getAttribute("url");
        if(url) {
          if(url.startsWith("./") || url.startsWith("/")) {
            url = serverDir + url.replace('./','/')
          }
          getFile(url);
        }

      });
      currentFolder.children('div').append(item);
    }
  }
}

export async function onReaderLoad(event){
  var obj = JSON.parse(event.target.result);
  JsonTraitment(obj);
}

export function getFile(url) {
  upload.openfile(null);
  $("#downloadProgress").remove();
  var parent = $(".bolder").parent();
  parent.append("<div id='downloadProgress'><i id='stopRequest' class='fas fa-stop-circle'></i><div id='loadingLabel'>"+ replaceLocal({ name: "LOADING"}) +"</div><div id='progress' class='progress' value='0'></div></div>");
  var progressBar = $("#progress");

  var ajxRequest = $.ajax({ 
    xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                progressBar.css({
                    width: percentComplete * 100 + '%'
                });
                if(percentComplete == 1) {
                  $("#downloadProgress").remove();
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
      success: function (data, textStatus, xhr) {
        upload.openfile(null);
        var encodedData = new AMF.Deserializer(data);
        upload.repeat(encodedData, true);
      },
      error: function( req, status, err ) {
        $("#downloadProgress").remove();
        $("#output").css("display", "none");
      }
  });

  var stopButton = $("#stopRequest");
  stopButton.on("click", function(event) {
    event.stopPropagation();
    ajxRequest.abort();
    $("#downloadProgress").remove();
    $("#output").css("display", "none");
  });
}

addLibraryInput.on('change',function (event)
{
    importLibrary(event)
});
addFilesInput.on("change", uploadFiles);

setupSettings().then(() => {
  getLocalization().then(_ => {
    setupScreen();
    readLocalJSON();
  });
});
