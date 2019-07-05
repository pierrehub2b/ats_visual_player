var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element, frameCounter) {
    if(frameCounter ==1) {
        implementAnimationStart(element);
    } else {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element) {
    var frameId = "stateWindowFrame" + element.timeLine;
    var titleId = "stateWindowTitle" + element.timeLine;
    var contentId = "stateWindowContent" + element.timeLine;
    
    var frame = $(base.frameBackground);
    var frameTitle = $(base.frameTitle);
    var frameContent = $(base.frameContent);

    frame.attr("id", frameId);
    frameTitle.attr("id", titleId);
    frameContent.attr("id", contentId);
  
    var localField = app.replaceLocal({name:"RESTORE"});
    if(element.value == "reduce") {
        frame.children("img").attr("src", base.pathToAssets + "reduce.png");
        localField = app.replaceLocal({name:"REDUCE"});
    } else {
        frame.children("img").attr("src", base.pathToAssets + "restore.png");
    }

    frameTitle.html(app.replaceLocal({name:"WINDOWSTATE"}));

    var text = base.format(app.replaceLocal({name:"WINDOWSTATETEXT"}), localField);
    frameContent.append('<p>'+text+'</p>')

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.displayPopUp(frame, frameTitle, frameContent, 1);
}

export function implementAnimationEnd(element) {
    var frame = $("#stateWindowFrame" + element.timeLine);
    var frameTitle = $("#stateWindowTitle" + element.timeLine);
    var frameContent = $("#stateWindowContent" + element.timeLine);
    base.hidePopUp(frame, frameTitle, frameContent);
}