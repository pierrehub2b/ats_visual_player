import { replaceLocal } from './../app';
import { frameBackground, frameTitle, frameContent, format, displayPopUp, hidePopUp } from './baseAnimation';
import $ from 'jquery';

export function implementAnimation(element) {
    var frameId = "channelSwitchFrame" + element.timeLine;
    var titleId = "channelSwitchFrame" + element.timeLine;
    var contentId = "channelSwitchFrame" + element.timeLine;

    var currentFrame = $(frameBackground);
    var currentTitle = $(frameTitle);
    var currentContent = $(frameContent);

    currentFrame.attr("id", frameId);
    currentTitle.attr("id", titleId);
    currentContent.attr("id", contentId);

    currentFrame.children("img").css("display", "none");
    currentTitle.html(replaceLocal({name:"SWITCHCHANNEL"}));

    var text = format(replaceLocal({name:"SWITCHCHANNELTEXT"}), true, element.channelName);
    currentContent.append('<p>'+text+'</p>')

    $("#screenBackground").append(currentFrame);
    currentFrame.append(currentTitle);
    currentFrame.append(currentContent);

    displayPopUp(currentFrame, currentTitle, currentContent, 2);
    hidePopUp(currentFrame, currentTitle, currentContent);
}