if (module.hot) {
  module.hot.accept()
}

import './style/app.scss';
import './style/custom.scss';
import './style/styleAnimation.scss';
import { setupScreen, create_UUID } from './uploader';
import AMF from 'amf-js';
var $ = require('jQuery');
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
export var currentReportName = null;

export var libraryExpanded = true;
export var localeValues = null;
export var currentLocale = "en";
export var waitingCoefficient = 1;
export var jsonLibraryUrl = '/library.json';
export var header = { 
  "accept": "application/json",
   "Access-Control-Allow-Origin":"*"
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

export async function getLocalization() {
  await $.ajax({
    type: "GET",
    url: serverDir + '/locales/locale.json',
    data: {},
    crossDomain:true,
    headers: header,
    success: function(data) {
      currentLocale = data.defaultLocale;
      switch(currentLocale) {
        case 'fr':
          waitingCoefficient = 0.5;
          break;
        case 'en':
          waitingCoefficient = 0.5;
          break;
      }
      return getLocalizationValues(currentLocale);
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
      setLibrary(data);
    }
  });
}

export async function setLocalizationValues() {
  var data = currentLocalValues;
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
  $('#filterATSVFiles').slideToggle(200);
  libraryExpanded = !libraryExpanded;
  if(libraryExpanded) {
    $("#libraryTitleCaret").attr("src", "assets/icons/32/caret_up.png")
  } else {
    $("#libraryTitleCaret").attr("src", "assets/icons/32/caret_down.png")
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
    flashReport.fadeTo(500, 1);
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

export function collapseFolder(event) {
  event.stopPropagation();
  var elem = $("#" + event.target.parentNode.id);
  elem.children('div').slideToggle(200);
  elem.children('#chapterContainer').slideToggle(200);
  var iElem = elem.children('.appIcon');
  if(iElem.attr("src").indexOf("open") >= 0) {
    iElem.attr("src","assets/icons/32/folder_close.png");
  } else {
    iElem.attr("src","assets/icons/32/folder_open.png");
  }
}

export function uploadFiles(event) {
  let files = event.target.files;
  var folders = $("#defaultFolder").length;

  if(folders == 0) {
    //creation d'un dossier défaut 
    var ulFolder = $("<ul id='defaultFolder'><img class='appIcon' src='assets/icons/32/folder_open.png' /><p>"+replaceLocal({ name: "LOCALFOLDER"})+"</p><div></div></ul>");
    listATSV.append(ulFolder);
    ulFolder.children("p").on("click", collapseFolder);
    ulFolder.children("img").on("click", collapseFolder);
  }

  var folder = $("#defaultFolder");

  for (let i=0; i<files.length; i++) {
    if(files[i].type == "application/ats.action-test-script.visual-report") {
      var fileName = files[i].name;
      if(folder.find("p").toArray().filter(p => p.innerText == fileName).length > 0) {
        console.log("Element already exist in list.")
        continue;
      }      
      var item = $("<img class='appIcon' src='assets/icons/32/movie.png' /><li class='atsvList'><p>"+ fileName +"</p></li>");
      item.on("click", function(event) {
        event.stopPropagation();
        if(currentReportName == item[1].innerText) {
          return;
        }
        currentReportName = item[1].innerText;
        $(".atsvList > p").removeClass("bolder");
        event.target.classList.add("bolder");
        upload.openfile(files[i], currentReportName);
      });
      folder.children('div').append(item);
    }
  };
}

export function setLibrary(data) {
  for (let i = 0; i < data.folders.length; i++) {
    const folder = data.folders[i];
    var name = folder.name;
    var ulFolder = $("<ul id='"+name.replace(/ /g, '')+"'><img class='appIcon' src='assets/icons/32/folder_open.png' /><p>"+name+"</p><div></div></ul>");
    listATSV.append(ulFolder);
    var currentFolder = $("#"+name.replace(/ /g, ''));
    currentFolder.children("p").on("click", collapseFolder);
    currentFolder.children("img").on("click", collapseFolder);
    var urls = folder.urls;
    for (let index = 0; index < urls.length; index++) {
      const url = urls[index];
      url = url.replace(/\\/g, '/');
      const table = url.split("/");
      const fileName = table[table.length-1];
      // if(fileName.length > 45) {
      //   fileName = fileName.substring(0,40) + " ...";
      // }
      var item = $("<img class='appIcon' src='assets/icons/32/movie.png' /><li class='atsvList'><p>"+ fileName +"</p></li>");
      item.attr("url", url);
      item.on("click", function(event) {
        event.stopPropagation();
        $(".atsvList > p").removeClass("bolder");
        event.target.classList.add("bolder");
        url = event.target.parentNode.getAttribute("url");
        if(currentReportName == url) {
          return;
        }
        if(url) {
          if(url.startsWith("./") || url.startsWith("/")) {
            url = serverDir + url.replace('./','/')
          }
          getFile(url, event.target);
        }
      });
      currentFolder.children('div').append(item);
    }
  }
}

export async function onReaderLoad(event){
  var obj = JSON.parse(event.target.result);
  setLibrary(obj);
}

export function clearOtherReadingState() {
  var atsvFiles = $("#listATSV").find(".progressDownload").toArray();
  for (let a = 0; a < atsvFiles.length; a++) {
    var currentElement = atsvFiles[a];
    if($(currentElement).attr("data-label") == replaceLocal({ name: "READING"})) {
      $(currentElement).attr("data-label", replaceLocal({ name: "LOADED"}));
      $(currentElement).css("color", "green");
    }
  }
}

export function getUrlParameter( name, url ) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : results[1];
}

export function getFile(url, target) {
  var parent = $(".bolder").parent();
  if(target) {
    parent = $(target).parent();
  }

  var id = create_UUID();
  parent.children("#chapterContainer").css("display",'none');
  parent.find("#loadingLabel").parent().remove();
  var localField = replaceLocal({ name: "LOADING"});
  parent.children(".progressDownload").remove();

  var tmpl = '<div id="progressDownload'+id+'" class="progressDownload" data-label="'+localField+'"><span class="value"></span></div><img id="stopRequest" class="appIcon" src="assets/icons/32/cancel.png" />';
  parent.append(tmpl);

  var ajxRequest = $.ajax({ 
    xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                $("#progressDownload" + id).children(".value").css("width", (percentComplete * 100) + "%");
                if(percentComplete == 1) {
                  $("#progressDownload" + id).parent().children("#stopRequest").remove();
                  $("#progressDownload" + id).attr("data-label", replaceLocal({ name: "LOADED"})).css("color", "green");
                  $("#progressDownload" + id).addClass("downloadOver");
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
        if(currentReportName == url) {
          return;
        }
        currentReportName = url;
        upload.openfile(null,null);
        var encodedData = new AMF.Deserializer(data);
        upload.repeat(encodedData, true);
      },
      error: function( req, status, err ) {
        $("#progressDownload" + id).remove();
        $("#progressDownload" + id).siblings("#stopRequest").remove();
      }
  });

  var stopButton = $("#stopRequest");
  stopButton.on("click", function(event) {
    event.stopPropagation();
    ajxRequest.abort();
    $("#progressDownload" + id).remove();
    $(event.target).remove();
  });
}

export function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                return allText;
            }
        }
    }
    rawFile.send(null);
}

setupScreen();
setupSettings().then(() => {
  getLocalization().then(_ => {
    readLocalJSON();
    var param = getUrlParameter("url", window.location.href);
    if(param && param != "") {
      getFile(param, null);
    }
  });
});


var param = getUrlParameter("url", window.location.href);
if(param && param != "") {
  getFile(param, null);
}
