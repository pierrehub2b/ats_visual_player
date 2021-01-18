import { replaceLocal } from '../app';
import { frameBackground, frameTitle, box, frameContent, pathToAssets32 , format, calculPositions, createBox, displayPopUp, hidePopUp, hideBox } from './baseAnimation';
import $ from 'jquery';
import { timelLineLite } from '../uploader';

export function implementAnimation(element, frameCounter, inputEvent) {
    if(frameCounter ==1) {
        implementAnimationStart(element, inputEvent);
    } else {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element, inputEvent) {
    var frameId = "dialogBoxFrame" + element.timeLine;
    var titleId = "dialogBoxTitle" + element.timeLine;
    var contentId = "dialogBoxContent" + element.timeLine;

    var currentFrame = $(frameBackground);
    var currentTitle = $(frameTitle);
    var currentContent = $(frameContent);

    currentFrame.attr("id", frameId);
    currentTitle.attr("id", titleId);
    currentContent.attr("id", contentId);

    currentFrame.children("img").css("display", "none");
    currentTitle.html(replaceLocal({name:"DIALOGACTION"}));

    var text = "";
    if(inputEvent) {
        text = format(replaceLocal({name:"DIALOGACTIONINPUTDETAILS"}), true, element.value);
    } else {
        text = format(replaceLocal({name:"DIALOGACTIONCLICKDETAILS"}), true, element.value);
    }

    currentContent.append('<p>'+text+'</p>')

    $("#screenBackground").append(currentFrame);
    currentFrame.append(currentTitle);
    currentFrame.append(currentContent);

    displayPopUp(currentFrame, currentTitle, currentContent, 2);
}

export function implementAnimationEnd(element) {
    var frame = $("#dialogBoxFrame"+element.timeLine);
    var currentTitle = $("#dialogBoxTitle"+element.timeLine);
    var currentContent = $("#dialogBoxContent"+element.timeLine);
    hidePopUp(frame, currentTitle, currentContent);
}