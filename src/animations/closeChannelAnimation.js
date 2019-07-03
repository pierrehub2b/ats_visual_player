var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element) {
    var frameId = "channelStopFrame" + element.timeLine;
    var titleId = "channelStopTitle" + element.timeLine;
    var contentId = "channelStopContent" + element.timeLine;
    
    var frame = $(base.frameBackground);
    var frameTitle = $(base.frameTitle);
    var frameContent = $(base.frameContent);

    frame.attr("id", frameId);
    frameTitle.attr("id", titleId);
    frameContent.attr("id", contentId);

    frame.children("img").attr("src", base.pathToAssets + "warning.png");
    frameTitle.html(app.replaceLocal({name:"CLOSECHANNEL"}));

    frameContent.append('<p id="channelName"><span class="textBolder">'+app.replaceLocal({name:"CHANNELNAME"}) + ': </span>' + element.channelName+'</p>');
    frameContent.append('<p id="channelPosition"><span class="textBolder">'+app.replaceLocal({name:"CHANNELPOSITION"}) + ':</span> ' + element.channelBound.x + " x " + element.channelBound.y +'</p>');
    frameContent.append('<p id="channelSize"><span class="textBolder">'+app.replaceLocal({name:"CHANNELSIZE"}) + ':</span> ' + element.channelBound.width + " x " + element.channelBound.height +'</p>');

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.displayPopUp(frame, frameTitle, frameContent, 3);
    base.hidePopUp(frame, frameTitle, frameContent, 3);
}