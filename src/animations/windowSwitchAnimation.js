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
    var frameId = "switchWindowFrame" + element.timeLine;
    var titleId = "switchWindowTitle" + element.timeLine;
    var contentId = "switchWindowContent" + element.timeLine;
    
    var frame = $(base.frameBackground);
    var frameTitle = $(base.frameTitle);
    var frameContent = $(base.frameContent);

    frame.attr("id", frameId);
    frameTitle.attr("id", titleId);
    frameContent.attr("id", contentId);
  
    frame.children("img").attr("src", base.pathToAssets + "switch_windows.png");
    frameTitle.html(app.replaceLocal({name:"WINDOWSWITCH"}));
    frameContent.append('<p id="channelName"><span class="textBolder">'+app.replaceLocal({name:"VALUE"}) + ': </span>' + element.value +'</p>')

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.displayPopUp(frame, frameTitle, frameContent, 3);
}

export function implementAnimationEnd(element) {
    var frame = $("#switchWindowFrame" + element.timeLine);
    var frameTitle = $("#switchWindowTitle" + element.timeLine);
    var frameContent = $("#switchWindowContent" + element.timeLine);
    base.hidePopUp(frame, frameTitle, frameContent, 3);
}