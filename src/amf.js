/*
amf.js - An AMF library in JavaScript
Copyright (c) 2010, James Ward - www.jamesward.com
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:
   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.
   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.
THIS SOFTWARE IS PROVIDED BY JAMES WARD ''AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JAMES WARD OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
The views and conclusions contained in the software and documentation are those of the
authors and should not be interpreted as representing official policies, either expressed
or implied, of James Ward.
*/
export function decodeAMF(data)
{
  var bytes = new a3d.ByteArray(data, a3d.Endian.BIG);

  //console.log(dumpHex(bytes));

  var version = bytes.readUnsignedShort();
  bytes.objectEncoding = a3d.ObjectEncoding.AMF0;

  var response = new a3d.AMFPacket();

  var remainingBytes;

  // Headers
  var headerCount = bytes.readUnsignedShort();
  for (var h = 0; h < headerCount; h++)
  {
    var headerName = bytes.readUTF();
    var mustUnderstand = bytes.readBoolean();
    bytes.readInt(); // Consume header length...

    // Handle AVM+ type marker
    if (version == a3d.ObjectEncoding.AMF3)
    {
      var typeMarker = bytes.readByte();
      if (typeMarker == a3d.Amf0Types.kAvmPlusObjectType)
        bytes.objectEncoding = a3d.ObjectEncoding.AMF3;
      else
        bytes.pos = bytes.pos - 1;
    }

    var headerValue = bytes.readObject();

   /*
     // Read off the remaining bytes to account for the reset of
     // the by-reference index on each header value
     remainingBytes = new a3d.ByteArray();
     remainingBytes.objectEncoding = bytes.objectEncoding;
     bytes.readBytes(remainingBytes, 0, bytes.length - bytes.pos);
     bytes = remainingBytes;
     remainingBytes = null;
     */
    
    var header = new a3d.AMFHeader(headerName, mustUnderstand, headerValue);
    response.headers.push(header);

    // Reset to AMF0 for next header
    bytes.objectEncoding = a3d.ObjectEncoding.AMF0;
  }

  // Message Bodies
  var messageCount = bytes.readUnsignedShort();
  for (var m = 0; m < messageCount; m++)
  {
    var targetURI = bytes.readUTF();
    var responseURI = bytes.readUTF();
    bytes.readInt(); // Consume message body length...

    // Handle AVM+ type marker
    if (version == a3d.ObjectEncoding.AMF3)
    {
      var typeMarker = bytes.readByte();
      if (typeMarker == a3d.Amf0Types.kAvmPlusObjectType)
        bytes.objectEncoding = a3d.ObjectEncoding.AMF3;
      else
        bytes.pos = bytes.pos - 1;
    }

    var messageBody = bytes.readObject();

    var message = new a3d.AMFMessage(targetURI, responseURI, messageBody);
    response.messages.push(message);

    bytes.objectEncoding = a3d.ObjectEncoding.AMF0;
  }

  return response;
}

export function dumpHex(bytes)
{
  var s = "";
  var i = 0;
  var chunk = [];

  while (i < bytes.length)
  {

    if (((i % 16) == 0) && (i != 0)) 
    {
      s += writeChunk(chunk, 16) + "\n";
      chunk = [];
    }

    chunk.push(bytes.readUnsignedByte());

    i++;
  }
  s += writeChunk(chunk, 16);

  bytes.pos = 0;

  return s;
}

export function writeChunk(chunk, width)
{
  var s = "";

  for (var i = 0; i < chunk.length; i++)
  {
    if (((i % 4) == 0) && (i != 0))
    {
      s += " ";
    }

    var b = chunk[i];

    var ss = b.toString(16) + " ";
    if (ss.length == 2)
    {
      ss = "0" + ss;
    }

    s += ss;
  }

  for (var i = 0; i < (width - chunk.length); i++)
  {
    s += "   ";
  }

  var j = Math.floor((width - chunk.length) / 4);
  for (var i = 0; i < j; i++)
  {
    s += " ";
  }

  s += "   ";

  for (var i = 0; i < chunk.length; i++)
  {
    var b = chunk[i];

    if ((b <= 126) && (b > 32))
    {
      var ss = String.fromCharCode(b);
      s += ss;
    }
    else
    {
      s += ".";
    }
  }

  return s;
}