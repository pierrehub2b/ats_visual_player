import AMF from 'amf-js';
import 'babel-polyfill';
import { TimelineMax, TimelineLite } from "gsap/TweenMax";
var $ = require('jQuery');
import './simpledrag';
import { replaceLocal, currentLocale, currentReportName, flashReport, clearOtherReadingState, uploadFiles, importLibrary } from './app';
import { implementAnimation as ActionGotoUrl } from './animations/gotuUrlAnimation';
import { implementAnimation as ActionChannelStart } from './animations/channelStartAnimation';
import { implementAnimation as ActionChannelSwitch } from './animations/channelSwitchAnimation';
import { implementAnimation as ActionMouseScroll } from './animations/mouseScrollAnimation';
import { implementAnimation as ActionChannelClose } from './animations/closeChannelAnimation';
import { implementAnimation as ActionMouseKey } from './animations/mouseKeyAnimation';
import { implementAnimation as ActionComment } from './animations/commentAnimation';
import { implementAnimation as ActionAssertValue } from './animations/assertionValueAnimation';
import { implementAnimation as ActionProperty } from './animations/propertyAnimation';
import { implementAnimation as ActionAssertProperty } from './animations/assertionPropertyAnimation';
import { implementAnimation as ActionAssertPropertyCount } from './animations/assertionPropertyCountAnimation';
import { implementAnimation as ActionText } from './animations/textAnimation';
import { implementAnimation as ActionJavascript } from './animations/javascriptAnimation';
import { implementAnimation as ActionMouse } from './animations/mouseAnimation';
import { implementAnimation as ActionWindowState } from './animations/windowStateAnimation';
import { implementAnimation as ActionWindowSwitch } from './animations/windowSwitchAnimation';
import { implementAnimation as ActionDragDrop } from './animations/dragDropAnimation';
var base = require('./animations/baseAnimation');

//#region objets du DOM
export var progressSlider = $("#progressSlider");
export var navSlider = $("#navSlider");
export var screenBackground = $("#screenBackground");
export var imgToolTip = $("#imgToolTip");
export var rangePointer = $("#rangePointer");
export var playBtn = $("#playButton");
export var pauseBtn = $("#pauseButton");
export var nextBtn = $("#nextButton");
export var prevBtn = $("#previousButton");
export var output = $("#output");
export var spinner = $("#spinner");
export var loadingCheckmark = $("#loadingCheckmark");
export var player = $("#player");
export var chapterTitle = $("#chapterTitle");
export var menu = $("#menu");
export var loadingPercent = $("#loadingPercent");
export var scriptName = $("#scriptName");
export var navBar = $(".nav");
export var addLibraryInput = $("#addLibraryInput");
export var addFilesInput = $("#addFilesInput");
//#endregion

//#region variables globales
export var allData = [];
export var images = [];
export var deferred = $.Deferred();
export var duration = new Date();
export var results = [];
export var timelLineLite;
export var currentUID; 
export var atsvUrl = "https://github.com/pierrehub2b/actiontestscript";
export var chapterExpanded = true;
export var frameForAction = 1;
export var currentFrameAction = 1;
export var isDrag = true;
export var tick = 0;
export var dateTime = new Date();
export var timer;
export var pauseAtNextLabel = false;
//#endregion

// enum sur les différents types d'objets dans allData
export const elementType = {
  FLASHREPORT: 'flashReport',
  CHAPTER: 'chapter',
  IMAGE: 'image'
}

export function create_UUID() {
  // I generate the UID from two parts here 
  // to ensure the random number provide enough bits.
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

export function showPlayerState(control) {
  var playerState = $(".playerState");
  var overlay = playerState.parent();
  switch(control) {
    case "play":
      $(".playerState").html("<img class='stateIcon' src='assets/icons/32/play.png' />");
      break;
    case "pause":
      $(".playerState").html("<img class='stateIcon' src='assets/icons/32/pause.png' />");
      break;
    case "previous":
      $(".playerState").html("<img class='stateIcon' src='assets/icons/32/prev.png' />");
      break;
    case "next":
      $(".playerState").html("<img class='stateIcon' src='assets/icons/32/next.png' />");
      break;
  }
  overlay.css("display", "flex");
  setTimeout(() => {
    $(".playerState").css("opacity", "0");
  }, 300);
  setTimeout(() => {
    overlay.css("display", "none");
    $(".playerState").css("opacity", "1");
  }, 500);
}

// instancie timeLineLite et met en place les eventListeners sur les boutons
export function setupScreen() {
  addLibraryInput.on('change',function (event)
    {
      importLibrary(event)
    });
    addFilesInput.on("change", uploadFiles);

  timelLineLite = new TimelineMax({ paused: true, repeat: 0, onUpdate:adjustUI});
  
  progressSlider.on("mouseup ", update);

  playBtn.on("click", function(event) {
    event.stopPropagation();
    playBtn.css("display","none");
    pauseBtn.css("display","inline-block");

    showPlayerState("play");
    timer = setInterval(startTimer, 1000);
    timelLineLite.play();
  });

  pauseBtn.on("click", function(event) {
    event.stopPropagation();
    playBtn.css("display","inline-block");
    pauseBtn.css("display","none");
    showPlayerState("pause");
    clearInterval(timer);
    timelLineLite.pause();
  });

  screenBackground.on("click", function() {
    if(playBtn.css("display") == "none") {
      pauseBtn.click();
    } else {
      playBtn.click();
    }
  })

  $(document).keydown(function(event) {
    if(event.keyCode == 32) {
      if(playBtn.css("display") == "none") {
        pauseBtn.click();
      } else {
        playBtn.click();
      }
    } 
    if(event.keyCode == 37) {
      prevBtn.click();
    } 
    if(event.keyCode == 39) {
      nextBtn.click();
    }
  });

  player.mouseover(function(event) {
    navBar.css("opacity","0.8");
  });

  player.mouseleave(function(event) {
    flashReport.css("opacity","0");
    navBar.css("opacity","0");
  });

  nextBtn.on("click", function(event) {
    event.stopPropagation();

    var currentSecond = timelLineLite.duration() * timelLineLite.progress();
    var labelArray = timelLineLite.getLabelsArray().filter(_ => _.name.indexOf("-f") >= 0);

    for (let index = 0; index < labelArray.length; index++) {
      const i = labelArray[index];
      if(i.time > currentSecond) {
        clearInterval(timer);
        timelLineLite.seek(i.name);
        playBtn.click();
        if(index + 1 < labelArray.length) {
          timelLineLite.addPause(labelArray[index+1].name, function() {
            pauseBtn.click();
            timelLineLite.removePause(labelArray[index+1].name);
            clearInterval(timer);
          });
        }
        break;
      }
    }
  });

  prevBtn.on("click", function(event) {
    event.stopPropagation();
    var progress = timelLineLite.progress();
    var imgNumber = Math.floor((((images.length -1) / 100) * (progress * 100)));
    var elems = $("img[id$='-f']");
    var lastImgId = null;
    for (let index = 0; index < elems.length; index++) {
      const i = elems[index];
      var nb = parseInt(i.id.match(/\d+/)[0]);
      if(nb < imgNumber) {
        lastImgId = i.id;
      } else {
        clearInterval(timer);
        timelLineLite.seek(lastImgId);
        playBtn.click();
        if(index + 1 < elems.length) {
          timelLineLite.addPause(elems[index].id, function() {
            pauseBtn.click();
            timelLineLite.removePause(elems[index].id);
            clearInterval(timer);
          });
        }
        break;
      }
    }
  });

  navSlider.on("mousemove", function(event) {
    updateTooltipImg(event);
  });

  navSlider.on("mouseleave", function() {
    imgToolTip.css("display", "none");
  });

  $(".closebtn").on("click", function(event) {
    event.stopPropagation();
    closeNav();
  });

  $(".openingButton").on("click", function(event) {
    event.stopPropagation();
    openNav();
  });

  var leftPane = document.getElementById('left-pane');
  var rightPane = document.getElementById('player');
  var paneSep = document.getElementById('panes-separator');

    var leftLimit = 15;
    var rightLimit = 50;

    paneSep.sdrag(function (el, pageX, startX, pageY, startY, fix) {

        fix.skipX = true;

        if (pageX < window.innerWidth * leftLimit / 100) {
            pageX = window.innerWidth * leftLimit / 100;
            fix.pageX = pageX;
        }
        if (pageX > window.innerWidth * rightLimit / 100) {
            pageX = window.innerWidth * rightLimit / 100;
            fix.pageX = pageX;
        }

        var cur = pageX / window.innerWidth * 100;
        if (cur < 0) {
            cur = 0;
        }
        if (cur > window.innerWidth) {
            cur = window.innerWidth;
        }


        var right = (100-cur);
        leftPane.style.width = cur + '%';       
        rightPane.style.width = right + '%';

    }, null, 'horizontal');
}

export function toAMFObjects(data) {
  var encodedData = new AMF.Deserializer(data.buffer);
  currentUID = create_UUID();
  encodedData.uuid = currentUID;
  repeat(encodedData, false);
}

export function traitmentDone() {
  spinner.addClass("loadingDone");
  var v = parseFloat(progressSlider.val()) * 100;
  //rangePointer.html(v.toFixed());
  loadingCheckmark.css("display", "block");
  //output.css("display", "none");
  var comments = allData.filter(_ => _.type === elementType.CHAPTER);
  for (let comm = 0; comm < comments.length; comm++) {
    const commentaire = comments[comm];
    //create line in timeline
    var left = (100 * getChapterPosition(commentaire.timeLine)) * navSlider.width() /100;
    $('<div class="chapterProgressBar" id="chapterProgressBar'+commentaire.timeLine+'"></div>').appendTo('#navSlider');
    var component = $("#chapterProgressBar"+commentaire.timeLine);
    component.css("left", left + "px");
    component.on("mouseover", function(event) {
      updateTooltipImg(event);
      $("#chapter"+commentaire.timeLine).addClass("hoverChapter");
    });
    component.on("mouseleave", function() {
      imgToolTip.css("display", "none");
      $("#chapter"+commentaire.timeLine).removeClass("hoverChapter");
    });
    component.on("click", function(event) {
      event.stopPropagation();
      updateByVal(getChapterPosition(commentaire.timeLine));
    });
  }
  var tlDuration = timelLineLite.duration()
  duration.setHours(0,0,tlDuration,0);
  $("#duration").html(replaceLocal({name: "SCRIPTDURATION"}) + ": " + getDuration(duration));
}

export function getDuration(date) {
  var str = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + 
  ":" + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
  return str;
} 

export function repeat(encodedData, newClick) {
  if(newClick) {
    currentUID = create_UUID();
    encodedData.uuid = currentUID;
  }
  if(currentUID != encodedData.uuid) {
    return;
  }
  if (encodedData.pos >= encodedData.buf.byteLength) { 
    results = encodedData.objectReferences.filter(_ => _ != undefined && _.type);
    if(results.length > 0) {
      resultSetup(results, percent);
      loadingPercent.html(100 + "%");
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
    loadingPercent.html(percent + "%");
    updateLoadingPointer(percent);
  }
  
  setTimeout(function() {
    repeat(encodedData, false);
  });
  
  //deferred.notify(results, Math.round(encodedData.pos/encodedData.buf.byteLength * 100)); 
  
}

export function updateTooltipImg(event) {
  imgToolTip.html("");
  var currentMouseXPos = (event.clientX - screenBackground.offset().left) - 70;
  if(images.length > 0) {
    
    var intvalue = Math.round(calcSliderPos(event));
    var objCopy = $('img[id^="sliderImg'+intvalue+'"]').clone();

    var currentTick = Math.round(timelLineLite.duration() * (calcSliderPos(event)/(images.length-1)));
    var d = new Date();
    d.setHours(0,0,currentTick,0);
    var currentTimer = getDuration(d);

    var timerDiv = "<p class='displayTimer'>"+currentTimer+"</p>";

    objCopy.attr("id", "toolTipImg");
    objCopy.css("max-width", "150px");
    objCopy.css("max-height", "100px");
    objCopy.css("opacity", 1);
    objCopy.css("position", "absolute");
    objCopy.css("left", 0);
    objCopy.css("display", "block");
    imgToolTip.css("display", "block");
    imgToolTip.append(objCopy);
    imgToolTip.append(timerDiv);
    imgToolTip.css("left", currentMouseXPos + 'px');
  }
}

export function calcSliderPos(e) {
  return images.length * e.offsetX / navSlider.width();
  //return (e.clientX - navSlider.offset().left) / navSlider.width();
}

export function openfile(file, id) {
  timelLineLite = new TimelineMax({ paused: true, repeat: 0, onUpdate:adjustUI});
  screenBackground.html("");
  allData = [];
  images = [];
  spinner.removeClass("loadingDone");
  flashReport.html("");
  loadingCheckmark.css("display", "none");
  chapterTitle.css("display", "none");
  //output.css("display", "inline-block");
  $(".chapterProgressBar").remove();
  $("#menu > li").remove();
  timelLineLite.progress(0).pause();
  updaterangePointer();
  duration.setHours(0,0,0,0);
  tick = 0;
  clearInterval(timer);
  timer = null;

  if(file != null && currentReportName == id) {
    loadFile(file);
  } 
}

export function loadFile(file) {
  //var file = input.prop('files')[0];
  if(file != undefined) {
    var reader = new FileReader();
    reader.onload = function() { 
      var uintArray = new Uint8Array(this.result);
      toAMFObjects(uintArray);
    }
  
    reader.readAsArrayBuffer(file);
  }
}

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
  tick = timelLineLite.duration() * progressSlider.val();
  progressSlider.val(timelLineLite.progress());
  updaterangePointer();
}

export function update(){
  timelLineLite.progress(parseFloat(progressSlider.val()));
  tick = timelLineLite.duration() * progressSlider.val();
  startTimer();
  updaterangePointer();
  clearInterval(timer);
  timelLineLite.pause();
  playBtn.css("display","inline-block");
  pauseBtn.css("display","none");
}

export function updateByVal(value){
  timelLineLite.progress(value);
  tick = timelLineLite.duration() * value;
  startTimer();
  updaterangePointer();
  clearInterval(timer);
  timelLineLite.pause();
  playBtn.css("display","inline-block");
  pauseBtn.css("display","none");
}

export function updaterangePointer() {
  if(progressSlider.val() == 0) {
    //flashReport.fadeTo(500, 1);
    $(".watermark").css("display", "none");
  } else if(progressSlider.val() > 0) {
    $(".watermark").css("display", "block");
  }

  if(progressSlider.val() == 1) {
    clearInterval(timer);
  }

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

export function stripHtml(html){
  // Create a new div element
  var temporalDivElement = document.createElement("div");
  // Set the HTML content with the providen
  temporalDivElement.innerHTML = html;
  // Retrieve the text property of the element (cross-browser support)
  return temporalDivElement.textContent || temporalDivElement.innerText || "";
}

export function openNav() {
  $("#left-pane").css("width","20%");
  $("#left-pane").css("display","block");
  $("#player").css("width","80%");
}

export function closeNav() {
  $("#left-pane").css("width","0%");
  $("#left-pane").css("display","none");
  $("#player").css("width","100%");
}

export function getChapterPosition(timeline) {
  return parseFloat((((100 / images.length) * images.filter(_ => _.timeLine <= timeline).length)/100).toFixed(2));
}

export function showBottomPanel() {
  navBar.css("opacity","0.8");
  setTimeout(() => {
    flashReport.css("opacity","1");
  }, 1000, setTimeout(() => {
    flashReport.css("opacity","0");
    playBtn.click();
  }, 4000), setTimeout(() => {
    navBar.css("opacity","0");
  }, 5000));  
}

export function resultSetup(result, percent) {
  //#region traitment
  var actions = result.filter(_ => _.type ? _.type.indexOf("com.ats") > -1 : false);
  var flashReportObject = result.filter(_ => _.type == "startVisualReport")[0];

  var atsvFiles = $("#listATSV").find(".atsvList").toArray();
  var current = currentReportName.split("/")[currentReportName.split("/").length-1];
  var parent = null;
  for (let a = 0; a < atsvFiles.length; a++) {
    var currentElement = atsvFiles[a];
    var fileName = currentElement.children[0].innerText
    if(fileName == current) {
      parent = currentElement;
    }
  }

  if(parent == null) { return; }

  if(flashReportObject) {
    clearOtherReadingState();
    if($(parent).children(".progressDownload").length == 0) {
      var tmpl = '<div id="progressDownload'+create_UUID()+'" class="progressDownload downloadOver" data-label="'+replaceLocal({ name: "READING"})+'"><span class="value"></span></div>';
      $(parent).append(tmpl);
    }
    $(parent).children(".progressDownload").css("color", "blue");
    $(parent).children(".progressDownload").attr("data-label", replaceLocal({ name: "READING"}));

    flashReport.html("");
    //$("#output").css("display", "block");
    scriptName.html(flashReportObject.name);
    $('head title', window.parent.document).text(flashReportObject.name);
    scriptName.css("display", "inline-block");

    var locale = "";
    switch(currentLocale) {
      case 'fr':
        locale = 'fr-FR';
        break;
      case 'en':
        locale = 'en-US';
        break;
    }

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:"2-digit", minute:"2-digit", second:"2-digit" };

    var undefinedValue = replaceLocal({ name: "UNDEFINEDVALUE"});
    var frData = {
      name: flashReportObject.name ? flashReportObject.name : undefinedValue,
      id:flashReportObject.id ? flashReportObject.id : undefinedValue,
      author:flashReportObject.author ? flashReportObject.author : undefinedValue,
      started:new Date(parseInt(flashReportObject.started)).toLocaleDateString(locale, options),
      duration: replaceLocal({ name: "LOADINGDURATION"}),
      description:flashReportObject.description ? flashReportObject.description : undefinedValue,
      prerequisite:flashReportObject.prerequisite ? flashReportObject.prerequisite : undefinedValue,
      groups:flashReportObject.groups ? flashReportObject.groups : undefinedValue
    }

    var output = format("<h3><a href='"+ atsvUrl +"' target='_blank'>"+ replaceLocal({ name: "VISUALREPORT"}) +"</a></h3>" +
    "<div>"+ replaceLocal({ name: "SCRIPTNAME"}) +": {name}</div>"+
    "<div>"+ replaceLocal({ name: "SCRIPTID"}) +": {id}</div>" +
    "<div>"+ replaceLocal({ name: "SCRIPTAUTHOR"}) +": {author}</div>" +
    "<div>"+ replaceLocal({ name: "SCRIPTSTARTER"}) +": {started}</div>" +
    "<div id='duration'>"+ replaceLocal({ name: "SCRIPTDURATION"}) +": {duration}</div>" +
    "<div>"+ replaceLocal({ name: "SCRIPTDESCRIPTION"}) +": {description}</div>" +
    "<div>"+ replaceLocal({ name: "SCRIPTPREREQUISTES"}) +": {prerequisite}</div>" +
    "<div>"+ replaceLocal({ name: "SCRIPTGROUPS"}) +": {groups}</div>",frData);

    flashReport.append(output);
    allData.push({timeLine: flashReportObject.timeLine, element: flashReportObject.element, type: elementType.FLASHREPORT, img: null});
    showBottomPanel();
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
        const img = element.images[i];
        var bytes = new Uint8Array(img);
        var imgPreview = document.createElement('img');
        imgPreview.src = "data:image/"+ element.imageType +";base64,"+ encode(bytes);
        imgPreview.id = "sliderImg"+ imgCounter;
        if(i == 0) {
          imgPreview.id += "-f";
        }
        imgCounter++;
        allData.push({timeLine: element.timeLine, element: element, type: elementType.IMAGE, img: imgPreview });
        currentImgs.push({timeLine: element.timeLine, element: element, type: elementType.IMAGE, img: imgPreview });
        screenBackground.append(imgPreview);
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

  $(".chapterProgressBar").remove();
  $("#chaptersList > li").remove();

  var chapterContainer = $("#chapterContainer");
  $("#chapterContainer").remove();



  $(parent).append(chapterContainer);
  if(chapterContainer.css("display") == "none") {
    chapterContainer.css("display","block");
  }
  chapterExpanded = true;
  chapterTitle.on("click", function(event) {
    event.stopPropagation();
    $('#chaptersList').slideToggle(200);
    chapterExpanded = !chapterExpanded;
    if(chapterExpanded) {
      $("#chapterTitleCaret").attr("src", "assets/icons/32/caret_up.png");
    } else {
      $("#chapterTitleCaret").attr("src", "assets/icons/32/caret_down.png");
    }
  });

  for (let comm = 0; comm < comments.length; comm++) {
    const commentaire = comments[comm];
    if(commentaire.element.data.length > 75) {
      commentaire.element.data = commentaire.element.data.substring(0, 70) + " ...";
    }
    $('<li class="chapterNode" id="chapter'+ commentaire.timeLine +'">' + stripHtml((comm+1) + '/ ' + commentaire.element.data) + '</li>').appendTo($("#chaptersList"));
    var component = $("#chapter" + commentaire.timeLine);
    component.click(function(event) {
      event.stopPropagation();
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

  $(base.mousePointer).remove();
  $(base.mousePointer).appendTo("#screenBackground");

  for (let currentImgIndex = 0; currentImgIndex < currentImgs.length; currentImgIndex++) {
    const element = currentImgs[currentImgIndex];
    animate(element, images.length-currentImgs.length+currentImgIndex);
  }
  //#endregion   
}

export function startTimer() {
  var d = new Date();
  tick++;
  d.setHours(0,0,tick,0);
  rangePointer.html(getDuration(d) + " / " + getDuration(duration));
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
        delay: 2
      });
      timelLineLite.to(images[index-1].img, 0, {
        display: "none"
      }); 
    }

    if(currentFrameAction == 1) {
      timelLineLite.addLabel(currentElement.img.id);
    }

    switch(currentElement.element.type) {
      case "com.ats.script.actions.ActionText":
        //OK
        frameForAction = 2;
        ActionText(currentElement.element, currentFrameAction);
        currentFrameAction++;
        if(currentFrameAction > frameForAction) {
          currentFrameAction = 1;
        }
        break;
      case "com.ats.script.actions.ActionGotoUrl":
        //OK
        frameForAction = 2;
        ActionGotoUrl(currentElement.element, currentFrameAction);
        currentFrameAction++;
        if(currentFrameAction > frameForAction) {
          currentFrameAction = 1;
        }
        break;
      case "com.ats.script.actions.ActionChannelStart":
        //OK
        ActionChannelStart(currentElement.element);
        break;
      case "com.ats.script.actions.ActionChannelClose":
        //OK
        ActionChannelClose(currentElement.element);
        break;
      case "com.ats.script.actions.ActionMouseKey":
        //OK
        frameForAction = 2;
        ActionMouseKey(currentElement.element, currentFrameAction);
        currentFrameAction++;
        if(currentFrameAction > frameForAction) {
          currentFrameAction = 1;
        }
        break;
      case "com.ats.script.actions.ActionMouseScroll":
        //OK
        frameForAction = 3;
        ActionMouseScroll(currentElement.element, currentFrameAction);
        currentFrameAction++;
        if(currentFrameAction > frameForAction) {
          currentFrameAction = 1;
        }
        break;
      case "com.ats.script.actions.ActionComment":
        //OK
        ActionComment(currentElement.element);
        break;
      case "com.ats.script.actions.ActionAssertCount":
        //OK
        ActionAssertPropertyCount(currentElement.element);
        break;
      case "com.ats.script.actions.ActionAssertProperty":
        //OK
        ActionAssertProperty(currentElement.element);
        break;
      case "com.ats.script.actions.ActionAssertValue":
        //OK
        ActionAssertValue(currentElement.element);
        break;
      case "com.ats.script.actions.ActionJavascript":
        //OK
        frameForAction = 2;
        ActionJavascript(currentElement.element, currentFrameAction);
        currentFrameAction++;
        if(currentFrameAction > frameForAction) {
          currentFrameAction = 1;
        }
        break;
      case "com.ats.script.actions.ActionMouse":
        //OK
        frameForAction = 2;
        ActionMouse(currentElement.element, currentFrameAction);
        currentFrameAction++;
        if(currentFrameAction > frameForAction) {
          currentFrameAction = 1;
        }
        break;
      case "com.ats.script.actions.ActionProperty":
        //OK
        ActionProperty(currentElement.element);
        break;
      case "com.ats.script.actions.ActionWindowState":
        //OK
        frameForAction = 2;
        ActionWindowState(currentElement.element, currentFrameAction);
        currentFrameAction++;
        if(currentFrameAction > frameForAction) {
          currentFrameAction = 1;
        }
        break;
      case "com.ats.script.actions.ActionWindowSwitch":
        //OK
        frameForAction = 2;
        ActionWindowSwitch(currentElement.element, currentFrameAction);
        currentFrameAction++;
        if(currentFrameAction > frameForAction) {
          currentFrameAction = 1;
        }
        break;
      case "com.ats.script.actions.ActionMouseDragDrop":
        //OK
        frameForAction = 2;
        ActionDragDrop(currentElement.element, currentFrameAction, isDrag);
        currentFrameAction++;
        if(currentFrameAction > frameForAction) {
          currentFrameAction = 1;
          isDrag = !isDrag;
        }
        break;
      case "com.ats.script.actions.ActionChannelSwitch":
          ActionChannelSwitch(currentElement.element);
        break;
    }
}