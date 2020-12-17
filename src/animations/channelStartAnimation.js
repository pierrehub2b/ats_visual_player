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

    frame.children("img").css("display", "none");
    frameTitle.html(app.replaceLocal({name:"STARTCHANNEL"}));

    var appChannel = "";
    if(isJson(element.data)) {
        appChannel = JSON.parse(element.data)["app"];
    } else {
        appChannel = element.data;
    }
    

    var text = base.format(app.replaceLocal({name:"STARTCHANNELTEXT"}), true, element.channelName, appChannel, element.channelBound.width + " x " + element.channelBound.height);
    frameContent.append('<p>'+text+'</p>')

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.displayPopUp(frame, frameTitle, frameContent, 2);
    base.hidePopUp(frame, frameTitle, frameContent);
}

export function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}