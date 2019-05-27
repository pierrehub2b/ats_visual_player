import "./a3d";
import AMF from 'amf-js';

// export function decodeAMF(bytes)
// {
//   var version = bytes.readUnsignedShort();
//   bytes.objectEncoding = a3d.ObjectEncoding.AMF0;

//   var response = new a3d.AMFPacket();

//   var remainingBytes;

//   // Headers
//   var headerCount = bytes.readUnsignedShort();
//   for (var h = 0; h < headerCount; h++)
//   {
//     var headerName = bytes.readUTF();
//     var mustUnderstand = bytes.readBoolean();
//     bytes.readInt(); // Consume header length...

//     // Handle AVM+ type marker
//     if (version == a3d.ObjectEncoding.AMF3)
//     {
//       var typeMarker = bytes.readByte();
//       if (typeMarker == a3d.Amf0Types.kAvmPlusObjectType)
//         bytes.objectEncoding = a3d.ObjectEncoding.AMF3;
//       else
//         bytes.pos = bytes.pos - 1;
//     }

//     var headerValue = bytes.readObject();

//    /*
//      // Read off the remaining bytes to account for the reset of
//      // the by-reference index on each header value
//      remainingBytes = new a3d.ByteArray();
//      remainingBytes.objectEncoding = bytes.objectEncoding;
//      bytes.readBytes(remainingBytes, 0, bytes.length - bytes.pos);
//      bytes = remainingBytes;
//      remainingBytes = null;
//      */
    
//     var header = new a3d.AMFHeader(headerName, mustUnderstand, headerValue);
//     response.headers.push(header);

//     // Reset to AMF0 for next header
//     bytes.objectEncoding = a3d.ObjectEncoding.AMF0;
//   }

//   // Message Bodies
//   var messageCount = bytes.readUnsignedShort();
//   for (var m = 0; m < messageCount; m++)
//   {
//     var targetURI = bytes.readUTF();
//     var responseURI = bytes.readUTF();
//     bytes.readInt(); // Consume message body length...

//     // Handle AVM+ type marker
//     if (version == a3d.ObjectEncoding.AMF3)
//     {
//       var typeMarker = bytes.readByte();
//       if (typeMarker == a3d.Amf0Types.kAvmPlusObjectType)
//         bytes.objectEncoding = a3d.ObjectEncoding.AMF3;
//       else
//         bytes.pos = bytes.pos - 1;
//     }

//     var messageBody = bytes.readObject();

//     var message = new a3d.AMFMessage(targetURI, responseURI, messageBody);
//     response.messages.push(message);

//     bytes.objectEncoding = a3d.ObjectEncoding.AMF0;
//   }

//   return response;
// }

// export function dumpHex(bytes)
// {
//   var i = 0;
//   //Create a 16byte buffer 
//   var buffer = new ArrayBuffer(bytes.length); 
  
//   //Create a DataView referring to the buffer 
//   var view = new DataView(buffer); 

//   while (i < bytes.length)
//   {
//     view.setUint8(i, bytes.readUnsignedByte()); 
//     i++;
//   }

//   bytes.pos = 0;

//   return view;
// }

// export function writeChunk(chunk, width)
// {
//   var s = "";

//   for (var i = 0; i < chunk.length; i++)
//   {
//     if (((i % 4) == 0) && (i != 0))
//     {
//       s += " ";
//     }

//     var b = chunk[i];

//     var ss = b.toString(16) + " ";
//     if (ss.length == 2)
//     {
//       ss = "0" + ss;
//     }

//     s += ss;
//   }

//   for (var i = 0; i < (width - chunk.length); i++)
//   {
//     s += "   ";
//   }

//   var j = Math.floor((width - chunk.length) / 4);
//   for (var i = 0; i < j; i++)
//   {
//     s += " ";
//   }

//   s += "   ";

//   for (var i = 0; i < chunk.length; i++)
//   {
//     var b = chunk[i];

//     if ((b <= 126) && (b > 32))
//     {
//       var ss = String.fromCharCode(b);
//       s += ss;
//     }
//     else
//     {
//       s += ".";
//     }
//   }

//   return s;
// }

// export function stringToUint(string) {
//   var string = btoa(unescape(encodeURIComponent(string))),
//       charList = string.split(''),
//       uintArray = [];
//   for (var i = 0; i < charList.length; i++) {
//       uintArray.push(charList[i].charCodeAt(0));
//   }
//   return new Uint8Array(uintArray);
// }

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