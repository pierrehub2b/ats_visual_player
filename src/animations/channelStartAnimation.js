var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element) {
    var frameId = "channelStartFrame" + element.timeLine;
    var titleId = "channelStartTitle" + element.timeLine;
    var contentId = "channelStartContent" + element.timeLine;
    
    var frame = $(base.frameBackground);
    var frameTitle = $(base.frameTitle);
    var frameContent = $(base.frameContent);

    frame.attr("id", frameId);
    frameTitle.attr("id", titleId);
    frameContent.attr("id", contentId);

    frame.children("img").attr("src", base.pathToAssets + "layers_go.png");
    frameTitle.html(app.replaceLocal({name:"STARTCHANNEL"}));

    frameContent.append('<p id="channelName"><span class="textBolder">'+app.replaceLocal({name:"CHANNELNAME"}) + ': </span>' + element.channelName+'</p>')
    frameContent.append('<p id="channelApplication"><span class="textBolder">'+app.replaceLocal({name:"CHANNELAPPLICATION"}) + ': </span>' + element.data+'</p>')
    frameContent.append('<p id="channelPosition"><span class="textBolder">'+app.replaceLocal({name:"CHANNELPOSITION"}) + ':</span> ' + element.channelBound.x + " x " + element.channelBound.y +'</p>')
    frameContent.append('<p id="channelSize"><span class="textBolder">'+app.replaceLocal({name:"CHANNELSIZE"}) + ':</span> ' + element.channelBound.width + " x " + element.channelBound.height +'</p>')

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.displayPopUp(frame, frameTitle, frameContent, 3);

    base.hidePopUp(frame, frameTitle, frameContent, 3);
}