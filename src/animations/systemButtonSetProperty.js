import { replaceLocal } from '../app';
import { frameBackground, frameTitle, box, frameContent, pathToAssets32 , format, calculPositions, createBox, displayPopUp, hidePopUp, hideBox } from './baseAnimation';
import $ from 'jquery';

export function implementAnimation(element) {
    var frameId = "sysButtonPropertyFrame" + element.timeLine;
    var titleId = "sysButtonPropertyTitle" + element.timeLine;
    var contentId = "sysButtonPropertyContent" + element.timeLine;

    var currentFrame = $(frameBackground);
    var currentTitle = $(frameTitle);
    var currentContent = $(frameContent);

    currentFrame.attr("id", frameId);
    currentTitle.attr("id", titleId);
    currentContent.attr("id", contentId);

    currentFrame.children("img").css("display", "none");
    currentTitle.html(replaceLocal({name:"SETPROPERTY"}));

    var text = format(replaceLocal({name:"SETPROPERTYTEXT"}), true, element.value, element.data);
    currentContent.append('<p>'+text+'</p>')

    $("#screenBackground").append(currentFrame);
    currentFrame.append(currentTitle);
    currentFrame.append(currentContent);

    displayPopUp(currentFrame, currentTitle, currentContent, 2);
    hidePopUp(currentFrame, currentTitle, currentContent);
}