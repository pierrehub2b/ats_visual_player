var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');
var elemNotFound = require('./elementNotFoundAnimation');

export function implementAnimation(element, frameCounter) {
    if(frameCounter ==1) {
        implementAnimationStart(element);
    } else {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element) {
    if(element.error < 0) {
        elemNotFound.implementAnimation(element, app.replaceLocal({name:"STATECHANGE"}));
        return;
    }
    var frameId = "switchWindowFrame" + element.timeLine;
    var titleId = "switchWindowTitle" + element.timeLine;
    var contentId = "switchWindowContent" + element.timeLine;
    
    var frame = $(base.frameBackground);
    var frameTitle = $(base.frameTitle);
    var frameContent = $(base.frameContent);

    frame.attr("id", frameId);
    frameTitle.attr("id", titleId);
    frameContent.attr("id", contentId);
  
    frame.children("img").css("display", "none");
    frameTitle.html(app.replaceLocal({name:"WINDOWSTATE"}));

    var text = base.format(app.replaceLocal({name:"WINDOWSWITCHTEXT"}), true, element.value);
    frameContent.append('<p>'+text+'</p>')


    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.displayPopUp(frame, frameTitle, frameContent, 2);
}

export function implementAnimationEnd(element) {
    if(element.error < 0) {
        return;
    }
    var frame = $("#switchWindowFrame" + element.timeLine);
    var frameTitle = $("#switchWindowTitle" + element.timeLine);
    var frameContent = $("#switchWindowContent" + element.timeLine);
    base.hidePopUp(frame, frameTitle, frameContent);
}