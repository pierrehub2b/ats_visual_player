import { replaceLocal } from './../app';
import { frameBackground, frameTitle, frameContent, format, displayPopUp, hidePopUp } from './baseAnimation';
import $ from 'jquery';
import { implementNotFoundAnimation } from './elementNotFoundAnimation';

export function implementAnimation(element, frameCounter) {
    if(frameCounter ==1) {
        implementAnimationStart(element);
    } else {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element) {
    if(element.error < 0) {
        implementNotFoundAnimation(element, replaceLocal({name:"STATECHANGE"}));
        return;
    }
    var frameId = "stateWindowFrame" + element.timeLine;
    var titleId = "stateWindowTitle" + element.timeLine;
    var contentId = "stateWindowContent" + element.timeLine;

    var currentFrame = $(frameBackground);
    var currentTitle = $(frameTitle);
    var currentContent = $(frameContent);

    currentFrame.attr("id", frameId);
    currentTitle.attr("id", titleId);
    currentContent.attr("id", contentId);
  
    var localField = "";
    if(element.value == "reduce") {
        localField = replaceLocal({name:"REDUCE"});
    } else if(element.value == "maximize") {
        localField = replaceLocal({name:"RESTORE"});
    } else {
        localField = replaceLocal({name:"CLOSE"});
    }
    currentFrame.children("img").css("display", "none");

    currentTitle.html(replaceLocal({name:"WINDOWSTATE"}));

    var text = format(replaceLocal({name:"WINDOWSTATETEXT"}), true, localField);
    currentContent.append('<p>'+text+'</p>')

    $("#screenBackground").append(currentFrame);
    currentFrame.append(currentTitle);
    currentFrame.append(currentContent);

    displayPopUp(currentFrame, currentTitle, currentContent, 2);
}

export function implementAnimationEnd(element) {
    if(element.error < 0) {
        return;
    }
    var frame = $("#stateWindowFrame" + element.timeLine);
    var frameTitle = $("#stateWindowTitle" + element.timeLine);
    var frameContent = $("#stateWindowContent" + element.timeLine);
    hidePopUp(frame, frameTitle, frameContent);
}