import AMF from 'amf-js';
var $ = require('jQuery');
import { TimelineMax, Power1 } from "gsap/TweenMax";

export var tl;
export var progressSlider = $("#progressSlider");
export var slideShow = $("#slideshow");
export var progressDisplay = $("#progressDisplay");
export var playLabelBtn = $("#playLabel");
export var pauseLabelBtn = $("#pauseLabel");
export var restartBtn = $("#restart");
export var fullScreen = $("#fullScreen");
export var output = $("#output");
export var spinner = $("#spinner");
export var checkmark = $("#checkmark");
export var player = $("#player");
export var input = $("#uploader");
export var images = [];
export var quotient = 0.8;
export var fullScreenState = false;
export var ratio = 1;

export function setupScreen() {
  tl = new TimelineMax({ paused: true, repeat: 0, onUpdate:adjustUI});
  
  progressSlider.on("change", update);

  playLabelBtn.on("click", function() {
    tl.play();
  });

  restartBtn.on("click", function() {
    tl.restart();
  });

  pauseLabelBtn.on("click", function() {
    tl.pause();
  });

  fullScreen.on("click", function() {
    if(fullScreenState) {
      player.css({
        top: "unset",
        right: "unset",
        bottom: "unset",
        left: "unset",
        zIndex: "unset"
      });
      $(".fa-compress").addClass('fa-expand').removeClass('fa-compress');
      //setup the default screen size
      slideShow.css( "height", "80vh");
      slideShow.css( "width",  40 * ratio + "vw");
      player.css( "width",  40 * ratio + "vw");
      progressSlider.css("width", ((40 * ratio)-15) + "vw");
    } else {
      player.css({
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999
      });
      $(".fa-expand").addClass('fa-compress').removeClass('fa-expand');
      //setup the default screen size
      slideShow.css( "height", "95vh");
      slideShow.css( "width",  "100vw");
      player.css( "width",  "100vw");
      progressSlider.css("width", "85vw");
    }
    fullScreenState = !fullScreenState;
  });
}

export function openfile() {
  tl = new TimelineMax({ paused: true, repeat: 0, onUpdate:adjustUI});
  slideShow.html("");
  images = [];
  spinner.removeClass("load-complete");
  checkmark.css("display", "none");
  output.css("display", "inline-block");
  tl.progress(0).pause();
  updateProgressDisplay();
  var file = input.prop('files')[0];
  var reader = new FileReader();
  reader.onload = function() { 
    var uintArray = new Uint8Array(this.result);
    deserialize(uintArray);
  }

  reader.readAsArrayBuffer(file);
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

export function adjustUI() {
  progressSlider.val(tl.progress());
  updateProgressDisplay();
}

export function update(){
  tl.progress(parseFloat(progressSlider.val())).pause();
  updateProgressDisplay();
}

export function updateProgressDisplay() {
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

export function deserialize(data) {
  var encodedData = new AMF.Deserializer(data.buffer);
  while(encodedData.pos < encodedData.buf.byteLength) {
    encodedData.deserialize();
  }

  var actions = encodedData.objectReferences.filter(_ => _.type == "startVisualReport" || (_.type ? _.type.indexOf("com.ats") > -1 : false));

  var biggerWidth = 0;
  var biggerHeight = 0;

  for (let index = 0; index < actions.length; index++) {
    var element = actions[index];
    if(element.images) {
      for (let i = 0; i < element.images.length; i++) {
        const img = element.images[i];
        var bytes = new Uint8Array(img);
        var imgPreview = document.createElement('img');
        imgPreview.src = "data:image/"+ element.imageType +";base64,"+ encode(bytes);

        if(biggerWidth < element.channelBound.width * quotient) {
          biggerWidth = element.channelBound.width * quotient;
          biggerHeight = element.channelBound.height * quotient;
        }

        var previousValues = images.filter(_ => _.timeLine == element.timeLine);
        if(previousValues.length == 0) {
          var currentElement = {timeLine: element.timeLine, img: imgPreview, element: element};
          images.push(currentElement);
          slideShow.append(currentElement.img);
          // Create the animation
          animate({timeLine: element.timeLine, img: imgPreview, element: element});
        } 
      }
    }
  }

  ratio = biggerWidth / biggerHeight;
  var virtualSize = 40 * ratio;

  //setup the default screen size
  slideShow.css( "height", "80vh");
  slideShow.css( "width",  virtualSize + "vw");

  //player style 
  player.css( "height", "auto");
  player.css( "width",  virtualSize + "vw");

  //progressBar Width
  progressSlider.css("width", (virtualSize-15) + "vw");

  // change spinner state
  spinner.addClass("load-complete");
  checkmark.css("display", "block");
}

export function animate(currentElement) {
    //first element of the liste
    tl.to(currentElement.img, 1, {
      opacity: 1,
      display: "inline-block"
    }); 
    tl.to(currentElement.img, 0, {
      display: "none",
      delay: 3
    }); 
}

export function compareNombres(a, b) {
  return a - b;
}