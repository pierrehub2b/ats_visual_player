import AMF from 'amf-js';
import { TweenMax, TimelineMax } from "gsap/TweenMax";

export var tl;
export var progressSlider = document.getElementById("progressSlider");
export var slideShow = document.getElementById("slideshow");
export var progressDisplay = document.getElementById("progressDisplay");
export var playLabelBtn = document.getElementById("playLabel");
export var pauseLabelBtn = document.getElementById("pauseLabel");
export var restartBtn = document.getElementById("restart");
export var output = document.getElementById("output");
export var images = [];

export function setupScreen() {
  tl = new TimelineMax({ paused: true, repeat: 0, onUpdate:adjustUI});
  progressSlider.addEventListener("input", update);

  playLabelBtn.onclick = function() {
    tl.play();
  }
  
  restartBtn.onclick = function() {
    tl.restart();
  }

  pauseLabelBtn.onclick = function() {
    tl.pause();
  }
}

export function openfile() {
  var input = document.getElementById("uploader");
  slideShow.innerHTML = "";
  var file = input.files[0];
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
  progressSlider.value = tl.progress();
  updateProgressDisplay();
}

export function update(){
  tl.progress(progressSlider.value).pause();
  updateProgressDisplay();
}

export function updateProgressDisplay() {
  progressDisplay.innerHTML = progressSlider.value;
}

 
export function deserialize(data) {
  var encodedData = AMF.deserialize(data.buffer);
  var actions = encodedData.objectReferences.filter(_ => _.type == "startVisualReport" || (_.type ? _.type.indexOf("com.ats") > -1 : false));

  for (let index = 0; index < actions.length; index++) {
    var element = actions[index];
    if(element.images) {
      for (let i = 0; i < element.images.length; i++) {
        const img = element.images[i];
        var bytes = new Uint8Array(img);
        var imgPreview = document.createElement('img');
        imgPreview.style.height = "100%";
        imgPreview.src = "data:image/"+ element.imageType +";base64,"+ encode(bytes);

        // var svgimg = document.createElementNS("http://www.w3.org/2000/svg", "image");
        // svgimg.setAttribute( 'width', '100%' );
        // svgimg.setAttribute( 'height', '100%' );
        // svgimg.classList.add("myslides");
        // svgimg.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', "data:image/"+ element.imageType +";base64,"+ encode(bytes));

        images.push({timeLine: element.timeLine, img: imgPreview});
      }
    }
  }

  tl.progress.max = images.length;

  images.sort(function(a, b) {
    return a.timeLine - b.timeLine;
  });

  output.innerHTML = actions;

  for (let img = 0; img < images.length; img++) {
    const imgs = images[img];
    //tl.add( TweenLite.to(imgs.img, 2, {left:100}) );
    slideShow.appendChild(imgs.img);
  }

  animate();
}

export function animate() {
  var img = slideShow.getElementsByTagName('img');
  tl.append(TweenMax.staggerTo(img, 1, {css:{autoAlpha:2}, repeatDelay:0}, 1))
}

export function compareNombres(a, b) {
  return a - b;
}