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

    //frame.children("img").attr("src", base.pathToAssets + "close.png");
    frame.children("img").css("display", "none");
    frameTitle.html(app.replaceLocal({name:"CLOSECHANNEL"}));

    var text = base.format(app.replaceLocal({name:"CLOSECHANNELTEXT"}), true, element.channelName);

    frameContent.append('<p>'+text+'</p>');

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.displayPopUp(frame, frameTitle, frameContent, 2);
    base.hidePopUp(frame, frameTitle, frameContent);
}