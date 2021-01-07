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
    var frameId = "switchWindowFrame" + element.timeLine;
    var titleId = "switchWindowTitle" + element.timeLine;
    var contentId = "switchWindowContent" + element.timeLine;

    var currentFrame = $(frameBackground);
    var currentTitle = $(frameTitle);
    var currentContent = $(frameContent);

    currentFrame.attr("id", frameId);
    currentTitle.attr("id", titleId);
    currentContent.attr("id", contentId);
  
    currentFrame.children("img").css("display", "none");
    currentTitle.html(replaceLocal({name:"WINDOWSTATE"}));

    var text = format(replaceLocal({name:"WINDOWSWITCHTEXT"}), true, element.value);
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
    var frame = $("#switchWindowFrame" + element.timeLine);
    var title = $("#switchWindowTitle" + element.timeLine);
    var content = $("#switchWindowContent" + element.timeLine);
    hidePopUp(frame, title, content);
}