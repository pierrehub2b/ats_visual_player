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
    var frameId = "stateWindowFrame" + element.timeLine;
    var titleId = "stateWindowTitle" + element.timeLine;
    var contentId = "stateWindowContent" + element.timeLine;
    
    var frame = $(base.frameBackground);
    var frameTitle = $(base.frameTitle);
    var frameContent = $(base.frameContent);

    frame.attr("id", frameId);
    frameTitle.attr("id", titleId);
    frameContent.attr("id", contentId);
  
    var localField = "";
    if(element.value == "reduce") {
        //frame.children("img").attr("src", base.pathToAssets + "reduce.png");
        localField = app.replaceLocal({name:"REDUCE"});
    } else if(element.value == "maximize") {
        //frame.children("img").attr("src", base.pathToAssets + "restore.png");
        localField = app.replaceLocal({name:"RESTORE"});
    } else {
        //frame.children("img").attr("src", base.pathToAssets + "close.png");
        localField = app.replaceLocal({name:"CLOSE"});
    }
    frame.children("img").css("display", "none");

    frameTitle.html(app.replaceLocal({name:"WINDOWSTATE"}));

    var text = base.format(app.replaceLocal({name:"WINDOWSTATETEXT"}), true, localField);
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
    var frame = $("#stateWindowFrame" + element.timeLine);
    var frameTitle = $("#stateWindowTitle" + element.timeLine);
    var frameContent = $("#stateWindowContent" + element.timeLine);
    base.hidePopUp(frame, frameTitle, frameContent);
}