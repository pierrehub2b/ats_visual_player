import AMF from 'amf-js';
import 'babel-polyfill';
var $ = require('jQuery');
import { TimelineMax } from "gsap/TweenMax";
import { DH_CHECK_P_NOT_PRIME } from 'constants';
import { types } from 'util';

export var timelLineLite;

//#region objets du DOM
export var progressSlider = $("#progressSlider");
export var navSlider = $("#navSlider");
export var fondEcran = $("#fondEcran");
export var imgToolTip = $("#imgToolTip");
export var flashReport = $("#flashReportData");
export var avancementPointeur = $("#avancementPointeur");
export var playLabelBtn = $("#playLabel");
export var pauseLabelBtn = $("#pauseLabel");
export var restartBtn = $("#restart");
export var output = $("#output");
export var spinner = $("#spinner");
export var chargementCheckmark = $("#chargementCheckmark");
export var player = $("#player");
export var input = $("#uploader");
export var chapterTitle = $("#chapterTitle");
export var menu = $("#menu");
export var pourcentageAvancement = $("#pourcentageAvancement");
export var scriptName = $("#scriptName");
//#endregion

export const leftPanelWidth = 17; //vw

// tableaux des données
export var allData = [];
export var images = [];
export var deferred = $.Deferred();

// enum sur les différents types d'objets dans allData
export const elementType = {
  FLASHREPORT: 'flashReport',
  CHAPTER: 'chapter',
  IMAGE: 'image'
}

// instancie timeLineLite et met en place les eventListeners sur les boutons
export function setupScreen() {
  timelLineLite = new TimelineMax({ paused: true, repeat: 0, onUpdate:adjustUI});
  
  progressSlider.on("change", update);

  playLabelBtn.on("click", function() {
    timelLineLite.play();
  });

  restartBtn.on("click", function() {
    timelLineLite.restart();
  });

  pauseLabelBtn.on("click", function() {
    timelLineLite.pause();
  });

  progressSlider.on("mousemove", function(event) {
    updateTooltipImg(event);
  });
  progressSlider.on("mouseleave", function() {
    imgToolTip.css("display", "none");
  });

  $(".closebtn").on("click", function() {
    closeNav();
  });

  $(".boutonOuverture").on("click", function() {
    openNav();
  });
}

export function toAMFObjects(data) {
  // deferred = $.Deferred();
  // var promise = deferred.promise();
  var encodedData = new AMF.Deserializer(data.buffer);
  
  // promise.done(() => {
    
  // })
  // promise.fail(() => {
  //   console.log("Erreur lors de la génération de la vidéo.")
  // });
  // promise.progress((r, p) => {
  //   pourcentageAvancement.html(p + "%");
  //   resultSetup(r);
  // });

  repeat(encodedData);
}

export var duration;
export function traitmentDone() {
  spinner.addClass("chargementTermine");
  chargementCheckmark.css("display", "block");
  var comments = allData.filter(_ => _.type === elementType.CHAPTER);
  for (let comm = 0; comm < comments.length; comm++) {
    const commentaire = comments[comm];
    //create line in timeline
    var left = (100 * getChapterPosition(commentaire.timeLine)) * navSlider.width() /100;
    $('<div class="chapitresProgressBar" id="chapitresProgressBar'+commentaire.timeLine+'"></div>').appendTo('#navSlider');
    var component = $("#chapitresProgressBar"+commentaire.timeLine);
    component.css("left", left + "px");
    component.on("mouseover", function(event) {
      updateTooltipImg(event);
      $("#chapter"+commentaire.timeLine).addClass("hoverChapter");
    });
    component.on("mouseleave", function() {
      imgToolTip.css("display", "none");
      $("#chapter"+commentaire.timeLine).removeClass("hoverChapter");
    });
    component.on("click", function() {
      updateByVal(getChapterPosition(commentaire.timeLine));
    });
  }

  var dt = new Date();
  dt.setHours(0,0,0,duration);
  $("#duration").html("Duration: " + getDuration(dt));
  pourcentageAvancement.html("");
}

export function getDuration(date) {
  var str = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + 
  ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + 
  ":" + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
  return str;
} 

export var results = [];
export function repeat(encodedData) {
  if (encodedData.pos >= encodedData.buf.byteLength) { 
    results = encodedData.objectReferences.filter(_ => _ != undefined && _.type);
    if(results.length > 0) {
      resultSetup(results, percent);
      pourcentageAvancement.html(100 + "%");
      updateLoadingPointer(100);
    }
    traitmentDone();
    return 
  };
  encodedData.deserialize();
  if(encodedData.objectReferences.length > 10) {
    results = encodedData.objectReferences.filter(_ => _ != undefined && _.type);
    encodedData.objectReferences = [];
    resultSetup(results, percent);
    var percent = Math.round(encodedData.pos/encodedData.buf.byteLength * 100);
    pourcentageAvancement.html(percent + "%");
    updateLoadingPointer(percent);
  }
  
  setTimeout(function() {
    repeat(encodedData);
  });
  
  //deferred.notify(results, Math.round(encodedData.pos/encodedData.buf.byteLength * 100)); 
  
}

// calcul et mise en place du tooltip au survol de la progress bar
export function updateTooltipImg(event) {
  var currentMouseXPos = (event.clientX - fondEcran.offset().left) - 50;
  if(images.length > 0) {
    
    var intvalue = Math.round(calcSliderPos(event));
    var objCopy = $("#sliderImg" + intvalue).clone();

    objCopy.attr("id", "toolTipImg");
    objCopy.css("max-width", "150px");
    objCopy.css("max-height", "100px");
    objCopy.css("opacity", 1);
    objCopy.css("display", "block");
    imgToolTip.css("display", "block");
    imgToolTip.html(objCopy);
    imgToolTip.css("left", currentMouseXPos + 'px');
  }
}

export function calcSliderPos(e) {
  return images.length * e.offsetX / navSlider.width();
  //return (e.clientX - navSlider.offset().left) / navSlider.width();
}

export function openfile() {
  timelLineLite = new TimelineMax({ paused: true, repeat: 0, onUpdate:adjustUI});
  fondEcran.html("");
  allData = [];
  images = [];
  spinner.removeClass("chargementTermine");
  flashReport.html("");
  chargementCheckmark.css("display", "none");
  chapterTitle.css("display", "none");
  output.css("display", "inline-block");
  $(".chapitresProgressBar").remove();
  $("#menu > li").remove();
  duration = 0;
  timelLineLite.progress(0).pause();
  updateavancementPointeur();

  var file = input.prop('files')[0];
  if(file != undefined) {
    var reader = new FileReader();
    reader.onload = function() { 
      var uintArray = new Uint8Array(this.result);
      toAMFObjects(uintArray);
    }
  
    reader.readAsArrayBuffer(file);
  }
}

// encodage des images
export function encode (input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}

//#region maj de l'UI en fonction de l'avancée du slider
export function adjustUI() {
  progressSlider.val(timelLineLite.progress());
  updateavancementPointeur();
}

export function update(){
  timelLineLite.progress(parseFloat(progressSlider.val())).pause();
  updateavancementPointeur();
}

export function updateByVal(value){
  timelLineLite.pause();
  timelLineLite.progress(value);
  updateavancementPointeur();
}

export function updateavancementPointeur() {
  if(progressSlider.val() == 0 && flashReport.css("display") == "none") {
    flashReport.css("display", "block");
  } else if(progressSlider.val() > 0 && flashReport.css("display") == "block") {
    flashReport.css("display", "none");
  }

  var v = parseFloat(progressSlider.val()) * 100;
  avancementPointeur.html(v.toFixed());
  var val = (parseFloat(progressSlider.val()) - progressSlider.attr("min") / (progressSlider.attr("max") - progressSlider.attr("min")));
  var percent = val * 100;

  progressSlider.css('background-image',
        '-webkit-gradient(linear, left top, right top, ' +
        'color-stop(' + percent + '%, #FABA00), ' +
        'color-stop(' + percent + '%, #9BA0A5)' +
        ')');

  progressSlider.css('background-image','-moz-linear-gradient(left center, #FABA00 0%, #FABA00 ' + percent + '%, #9BA0A5 ' + percent + '%, #9BA0A5 100%)');
}
//#endregion

export function updateLoadingPointer(percent) {
  progressSlider.css('background-image',
  '-webkit-gradient(linear, left top, right top, ' +
  'color-stop(' + percent + '%, #9BA0A5), ' +
  'color-stop(' + percent + '%, #FCFCFC)' +
  ')');

  progressSlider.css('background-image','-moz-linear-gradient(left center, #9BA0A5 0%, #9BA0A5 ' + percent + '%, #FCFCFC ' + percent + '%, #FCFCFC 100%)');
}

// equivalent du string format en c#
export function format(str, col) {
  col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);

  return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
      if (m == "{{") { return "{"; }
      if (m == "}}") { return "}"; }
      return col[n];
  });
};

// eneleve les tags HTML dans les images de chapitres (par exemple les images)
export function stripHtml(html){
  // Create a new div element
  var temporalDivElement = document.createElement("div");
  // Set the HTML content with the providen
  temporalDivElement.innerHTML = html;
  // Retrieve the text property of the element (cross-browser support)
  return temporalDivElement.textContent || temporalDivElement.innerText || "";
}

export function openNav() {
  $("#mypanelGauche").css("width", leftPanelWidth + "vw");
  $(".panelGauche").css("padding-left","20px");
  $("#player").css("width", 99 - leftPanelWidth + "vw");
  $("#fondEcran").css("width",99 - leftPanelWidth + "vw");
  $(".nav").css("width",99 - leftPanelWidth + "vw");
}

export function closeNav() {
  $("#mypanelGauche").css("width","0");
  $(".panelGauche").css("padding-left","0");
  $("#player").css("width","100vw");
  $("#fondEcran").css("width","100vw");
  $(".nav").css("width","100vw");
}

export function getChapterPosition(timeline) {
  return parseFloat((((100 / images.length) * images.filter(_ => _.timeLine <= timeline).length)/100).toFixed(2));
}

export function resultSetup(result, percent) {
  //#region traitment
  var actions = result.filter(_ => _.type ? _.type.indexOf("com.ats") > -1 : false);
  var flashReportObject = result.filter(_ => _.type == "startVisualReport")[0];

  if(flashReportObject) {
    scriptName.html(flashReportObject.name);
    scriptName.css("display", "block");
    var frData = {
      name: flashReportObject.name,
      id:flashReportObject.id,
      author:flashReportObject.author,
      started:new Date(parseInt(flashReportObject.started)),
      duration:flashReportObject.duration,
      description:flashReportObject.description,
      prerequisite:flashReportObject.prerequisite,
      groups:flashReportObject.groups
    }

    var output = format("<h3>ATS Visual Report</h3>" +
    "<div>Script name: {name}</div>"+
    "<div>Script id: {id}</div>" +
    "<div>Author: {author}</div>" +
    "<div>Started: {started}</div>" +
    "<div id='duration'>Duration: {duration}</div>" +
    "<div>description: {description}</div>" +
    "<div>Prerequisite: {prerequisite}</div>" +
    "<div>Groups: {groups}</div>",frData);

    flashReport.append(output);
    allData.push({timeLine: flashReportObject.timeLine, element: flashReportObject.element, type: elementType.FLASHREPORT, img: null});
  }

  var imgCounter = allData.filter(_ => _.type === elementType.IMAGE).length;

  var currentImgs = [];
  for (let index = 0; index < actions.length; index++) {
    var element = actions[index];
    if(element.type.indexOf("ActionComment") > -1) {
      //commentaire fonctionnel
      allData.push({timeLine: element.timeLine, element: element, type: elementType.CHAPTER, img: null});
    }
    if(element.images) {
      for (let i = 0; i < element.images.length; i++) {
        var previousValues = allData.filter(_ => _.timeLine == element.timeLine && _.type === elementType.IMAGE);
        if(previousValues.length == 0) {
          const img = element.images[i];
          var bytes = new Uint8Array(img);
          var imgPreview = document.createElement('img');
          imgPreview.src = "data:image/"+ element.imageType +";base64,"+ encode(bytes);
          imgPreview.id = "sliderImg"+ imgCounter;
          imgCounter++;
          allData.push({timeLine: element.timeLine, element: element, type: elementType.IMAGE, img: imgPreview });
          currentImgs.push({timeLine: element.timeLine, element: element, type: elementType.IMAGE, img: imgPreview });
          fondEcran.append(imgPreview);
        } 
      }
    }
  }

  allData.sort(function(a,b) {
    return a.timeLine - b.timeLine;
  })

  var comments = allData.filter(_ => _.type === elementType.CHAPTER);

  if(comments.length > 0) {
    chapterTitle.css("display", "block");
  }

  $(".chapitresProgressBar").remove();
  $(".panelGauche > li").remove();

  for (let comm = 0; comm < comments.length; comm++) {
    const commentaire = comments[comm];
    $('<li id="chapter'+ commentaire.timeLine +'">' + stripHtml(commentaire.element.data) + '</li>').insertBefore($("#output"));
    var component = $("#chapter" + commentaire.timeLine);
    component.click(function() {
      updateByVal(getChapterPosition(commentaire.timeLine));
    });
    component.on("mouseover", function(event) {
      $("#chapter" + commentaire.timeLine).addClass("hoverChapter");
    });
    component.on("mouseleave", function() {
      $("#chapter" + commentaire.timeLine).removeClass("hoverChapter");
    });
  }

  images = allData.filter(_ => _.type === elementType.IMAGE);
  for (let currentImgIndex = 0; currentImgIndex < currentImgs.length; currentImgIndex++) {
    const element = currentImgs[currentImgIndex];
    duration += element.element.duration;
    animate(element, images.length-currentImgs.length+currentImgIndex);
  }
  //#endregion   
}

export function animate(currentElement, index) {
    if(index == 0) {
      timelLineLite.to(currentElement.img, 0.5, {
        opacity: 1,
        display: "inline-block"
      });
    } else {
      timelLineLite.to(currentElement.img, 0.5, {
        opacity: 1,
        display: "inline-block",
        delay: 1.5
      });
      timelLineLite.to(images[index-1].img, 0, {
        display: "none"
      }); 
    }   
}