import AMF from 'amf-js';
var $ = require('jQuery');
import { TimelineMax } from "gsap/TweenMax";

export var timelLineLite;

//#region objets du DOM
export var progressSlider = $("#progressSlider");
export var navSlider = $("#navSlider");
export var slideShow = $("#slideshow");
export var slidertitle = $("#slidertitle");
export var flashReport = $("#flashReportData");
export var progressDisplay = $("#progressDisplay");
export var playLabelBtn = $("#playLabel");
export var pauseLabelBtn = $("#pauseLabel");
export var restartBtn = $("#restart");
export var output = $("#output");
export var spinner = $("#spinner");
export var checkmark = $("#checkmark");
export var player = $("#player");
export var input = $("#uploader");
export var chapterTitle = $("#chapterTitle");
export var menu = $("#menu");
//#endregion

// tableaux des données
export var allData = [];
export var images = [];

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
    slidertitle.css("display", "none");
  });
}

export function toAMFObjects(buffer) {
  var dfd = $.Deferred();
  var encodedData = new AMF.Deserializer(buffer);
  while(encodedData.pos < encodedData.buf.byteLength) {
    encodedData.deserialize();
  } 
  dfd.resolve(encodedData);
  // Return the Promise so caller can't change the Deferred
  return dfd.promise();
}

// calcul et mise en place du tooltip au survol de la progress bar
export function updateTooltipImg(event) {
  var currentMouseXPos = (event.clientX + window.pageXOffset) - 50;
  if(images.length > 0) {
    
    var intvalue = Math.round((images.length / 100) * calcSliderPos(event)*100);
    var objCopy = $("#sliderImg" + intvalue).clone();

    objCopy.attr("id", "toolTipImg");
    objCopy.css("max-width", "150px");
    objCopy.css("max-height", "100px");
    objCopy.css("opacity", 1);
    objCopy.css("display", "block");
    slidertitle.css("display", "block");
    slidertitle.html(objCopy);
    slidertitle.css("left", currentMouseXPos + 'px');
  }
}

export function calcSliderPos(e) {
  return ( e.clientX - e.target.offsetLeft ) / e.target.clientWidth * parseFloat(e.target.getAttribute('max'));
}

export function openfile() {
  // remise à "zéro" des différents éléments de la page
  timelLineLite = new TimelineMax({ paused: true, repeat: 0, onUpdate:adjustUI});
  slideShow.html("");
  allData = [];
  images = [];
  spinner.removeClass("load-complete");
  flashReport.html("");
  checkmark.css("display", "none");
  chapterTitle.css("display", "none");
  output.css("display", "inline-block");
  $(".chapterLine").remove();
  $("#menu > li").remove();
  timelLineLite.progress(0).pause();
  updateProgressDisplay();


  var file = input.prop('files')[0];
  if(file != undefined) {
    var reader = new FileReader();
    reader.onload = function() { 
      var uintArray = new Uint8Array(this.result);
      deserialize(uintArray);
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
  updateProgressDisplay();
}

export function update(){
  timelLineLite.progress(parseFloat(progressSlider.val())).pause();
  updateProgressDisplay();
}

export function updateByVal(value){
  timelLineLite.progress(value).pause();
  updateProgressDisplay();
}

export function updateProgressDisplay() {
  if(progressSlider.val() == 0 && flashReport.css("display") == "none") {
    flashReport.css("display", "block");
  } else if(progressSlider.val() > 0 && flashReport.css("display") == "block") {
    flashReport.css("display", "none");
  }

  var v = parseFloat(progressSlider.val()) * 100;
  progressDisplay.html(v.toFixed());
  var val = (parseFloat(progressSlider.val()) - progressSlider.attr("min") / (progressSlider.attr("max") - progressSlider.attr("min")));
  var percent = val * 100;

  progressSlider.css('background-image',
        '-webkit-gradient(linear, left top, right top, ' +
        'color-stop(' + percent + '%, #FABA00), ' +
        'color-stop(' + percent + '%, #FCFCFC)' +
        ')');

  progressSlider.css('background-image','-moz-linear-gradient(left center, #FABA00 0%, #FABA00 ' + percent + '%, #FCFCFC ' + percent + '%, #FCFCFC 100%)');
}
//#endregion

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

export function getChapterPosition(timeline) {
  return parseFloat((((100 / images.length) * images.filter(_ => _.timeLine <= timeline).length)/100).toFixed(2));
}

export function deserialize(data) {
  $.when(toAMFObjects(data.buffer)).then(
    function(encodedData) {
        //#region traitment
        var actions = encodedData.objectReferences.filter(_ => _.type ? _.type.indexOf("com.ats") > -1 : false);
        var flashReportObject = encodedData.objectReferences.filter(_ => _.type == "startVisualReport")[0];
    
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
        "<div>Duration: {duration}</div>" +
        "<div>description: {description}</div>" +
        "<div>Prerequisite: {prerequisite}</div>" +
        "<div>Groups: {groups}</div>",frData);
    
        flashReport.append(output);
        allData.push({timeLine: flashReportObject.timeLine, element: flashReportObject.element, type: elementType.FLASHREPORT, img: null});
    
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
                imgPreview.id = "sliderImg"+ index;
                allData.push({timeLine: element.timeLine, element: element, type: elementType.IMAGE, img: imgPreview });
                slideShow.append(imgPreview);
              } 
            }
          }
        }
    
        allData.sort(function(a,b) {
          return a.timeLine - b.timeLine;
        })
    
        var comments = allData.filter(_ => _.type === elementType.CHAPTER);
        images = allData.filter(_ => _.type === elementType.IMAGE);
        images.shift();
        
        if(comments.length > 0) {
          chapterTitle.css("display", "block");
        }
        for (let comm = 0; comm < comments.length; comm++) {
          const commentaire = comments[comm];
    
          //create line in timeline
          var left = 100 * getChapterPosition(commentaire.timeLine);
          $('<div class="chapterLine" id="chapterLine'+commentaire.timeLine+'"></div>').appendTo('#navSlider');
          $("#chapterLine"+commentaire.timeLine).css("left", left + "%")
    
          $("#menu").append('<li id="chapter'+ commentaire.timeLine +'">' + stripHtml(commentaire.element.data) + '</li>');
          $("#chapter" + commentaire.timeLine).click(function() {
            updateByVal(getChapterPosition(commentaire.timeLine));
          });
        }
    
        for (let currentImgIndex = 0; currentImgIndex < images.length; currentImgIndex++) {
          const element = images[currentImgIndex];
          animate(element, currentImgIndex);
        }
    
        spinner.addClass("load-complete");
        checkmark.css("display", "block");
        //#endregion   
    }
  );
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