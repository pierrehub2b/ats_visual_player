if (module.hot) {
  module.hot.accept()
}

import './style/app.scss';
import './style/custom.scss';
import './style/animation.scss';
import AMF from 'amf-js';
var $ = require('jQuery');
import { setupScreen, create_UUID, progressSlider } from './uploader';
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
export var currentReportId = null;

export var libraryExpanded = true;
export var localeValues = null;
export var defaultLocale = null;
export var waitingCoefficient = 1;
export var jsonLibraryUrl = '/library.json';
export var header = { 
  "Access-Control-Allow-Origin" : "*",
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT'
};

var loc = window.location.pathname;
var serverDir = loc.substring(0, loc.lastIndexOf('/'));

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
            $("#watermarkImg").attr("src", serverDir + v.value);
            break;
          case 'URLWATERMARK':
            $("#watermarklink").attr("href", v.value);
            break;
          case 'IMGBACKGROUND':
            $("#screenBackground").css("background-image", 'url('+serverDir + v.value+')')
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
      switch(defaultLocale) {
        case 'fr':
          waitingCoefficient = 0.5;
          break;
        case 'en':
          waitingCoefficient = 0.5;
          break;
      }
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
    if(token.name == "SEARCHPLACEHOLDER") {
      $("#filterATSVFiles").attr("placeholder", token.value);
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

$("#infoLabel").on("click", function() {
  if(flashReport.css("opacity") == "0") {
    flashReport.fadeTo(500, 0.8);
  } else {
    flashReport.fadeTo(500, 0);
  }
});

$("#filterATSVFiles").keyup(filterList);
//#endregion

export function filterList(event){
  var val = event.target.value;
  var allATSV = $(".atsvList");
  if(val.length > 0) {
    for (let index = 0; index < allATSV.length; index++) {
      const element = allATSV[index];
      var content = element.firstChild.innerText;
      if(content.toUpperCase().indexOf(val.toUpperCase()) >= 0) {
        element.style.display = "list-item";
        element.previousElementSibling.style.display = "inline-block";
      } else {
        element.style.display = "none";
        element.previousElementSibling.style.display = "none";
      }
    }
  } else {
    for (let index = 0; index < allATSV.length; index++) {
      const element = allATSV[index];
      element.style.display = "list-item";
      element.previousElementSibling.style.display = "inline-block";
    }
  }
}

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
        currentReportId = create_UUID();
        $(".atsvList > p").removeClass("bolder");
        event.target.classList.add("bolder");
        currentReportId = create_UUID();
        upload.openfile(files[i], currentReportId);
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
  upload.openfile(null, null);
  var id = create_UUID();
  currentReportId = id;
  var parent = $(".bolder").parent();
  parent.append("<div id='downloadProgress"+id+"'><i id='stopRequest' class='fas fa-stop-circle'></i><div id='loadingLabel'>"+ replaceLocal({ name: "LOADING"}) +"</div><div id='progress' class='progress' value='0'></div></div>");
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
                  $("#downloadProgress"+id).remove();
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
        if(id == currentReportId) {
          upload.openfile(null, null);
          var encodedData = new AMF.Deserializer(data);
          upload.repeat(encodedData, true);
        } 
      },
      error: function( req, status, err ) {
        $("#downloadProgress"+id).remove();
        $("#output").css("display", "none");
      }
  });

  var stopButton = $("#stopRequest");
  stopButton.on("click", function(event) {
    event.stopPropagation();
    ajxRequest.abort();
    $("#downloadProgress"+id).remove();
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
