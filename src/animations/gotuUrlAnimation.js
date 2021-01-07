import { replaceLocal } from './../app';
import { frameBackground, frameTitle, frameContent, format, displayPopUp, hidePopUp } from './baseAnimation';
import $ from 'jquery';

export function implementAnimation(element, frameCounter) {
    if(frameCounter == 1) {
        implementAnimationStart(element);
    } else {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element) {
    var frameId = "goToUrlFrame" + element.timeLine;
    var titleId = "goToUrlTitle" + element.timeLine;
    var contentId = "goToUrlContent" + element.timeLine;

    var currentFrame = $(frameBackground);
    var currentTitle = $(frameTitle);
    var currentContent = $(frameContent);

    currentFrame.attr("id", frameId);
    currentTitle.attr("id", titleId);
    currentContent.attr("id", contentId);

    currentFrame.children("img").css("display", "none");
    currentTitle.html(replaceLocal({name:"GOTOURL"}));

    var text = format(replaceLocal({name:"GOTOURLTEXT"}), true, element.value);
    currentContent.append("<p>" + text + "</p>");

    $("#screenBackground").append(currentFrame);
    currentFrame.append(currentTitle);
    currentFrame.append(currentContent);

    displayPopUp(currentFrame, currentTitle, currentContent, 2);
}

export function implementAnimationEnd(element) {
    var frameBackground = $("#goToUrlFrame" + element.timeLine);
    var frameTitle = $("#goToUrlTitle" + element.timeLine);
    var frameContent = $("#goToUrlContent" + element.timeLine);
    hidePopUp(frameBackground, frameTitle, frameContent);
}