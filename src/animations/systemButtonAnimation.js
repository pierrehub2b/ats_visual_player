import { replaceLocal } from './../app';
import { format, frameBackground, frameContent, frameTitle, box, calculPositions, createBox, displayPopUp, hideBox, hidePopUp } from './baseAnimation';
import $ from 'jquery';
import { implementNotFoundAnimation } from './elementNotFoundAnimation';
import { timelLineLite } from '../uploader';

export function implementAnimation(element) {
    var frameId = "buttonActionFrame" + element.timeLine;
    var titleId = "buttonActionTitle" + element.timeLine;
    var contentId = "buttonActionContent" + element.timeLine;

    var currentFrame = $(frameBackground);
    var currentTitle = $(frameTitle);
    var currentContent = $(frameContent);

    currentFrame.attr("id", frameId);
    currentTitle.attr("id", titleId);
    currentContent.attr("id", contentId);

    currentFrame.children("img").css("display", "none");
    currentTitle.html(replaceLocal({name:"ACTIONBUTTON"}));

    var text = format(replaceLocal({name:"ACTIONBUTTONTEXT"}), true, element.value);
    currentContent.append('<p>'+text+'</p>')

    $("#screenBackground").append(currentFrame);
    currentFrame.append(currentTitle);
    currentFrame.append(currentContent);

    displayPopUp(currentFrame, currentTitle, currentContent, 2);
    hidePopUp(currentFrame, currentTitle, currentContent);
}