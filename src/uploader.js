import AMF from 'amf-js';

export var myIndex = 0;
export var duration = 2000;

export function openfile() {
  var input = document.getElementById("uploader");
  document.getElementById("slideshow").innerHTML = "";
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
 
export function deserialize(data) {
  var encodedData = AMF.deserialize(data.buffer);
  var actions = encodedData.objectReferences.filter(_ => _.type == "startVisualReport" || (_.type ? _.type.indexOf("com.ats") > -1 : false));
  var slideShow = document.getElementById("slideshow");

  console.log(actions);

  var images = [];

  for (let index = 0; index < actions.length; index++) {
    var element = actions[index];
    if(element.images) {
      for (let i = 0; i < element.images.length; i++) {
        const img = element.images[i];
        var bytes = new Uint8Array(img);

        var imgPreview = document.createElement('img');
        imgPreview.src = "data:image/"+ element.imageType +";base64,"+ encode(bytes);
        imgPreview.className = "mySlides";
        imgPreview.style.width = "100%";

        images.push({timeLine: element.timeLine, img: imgPreview});
      }
    }
  }

  images.sort(function(a, b) {
    return a.timeLine - b.timeLine;
  });

  for (let img = 0; img < images.length; img++) {
    const imgs = images[img];
    slideShow.appendChild(imgs.img);
  }

  carousel();
}

export function compareNombres(a, b) {
  return a - b;
}

export function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if(x) {
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}    
    x[myIndex-1].style.display = "block";  
    setTimeout(carousel, duration); // Change image every 2 seconds
  }
}