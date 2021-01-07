import { replaceLocal } from './../app';
import { frameBackground, frameTitle, frameContent, format, displayPopUp, hidePopUp } from './baseAnimation';
import $ from 'jquery';

export function implementAnimation(element) {
    var frameId = "channelStartFrame" + element.timeLine;
    var titleId = "channelStartTitle" + element.timeLine;
    var contentId = "channelStartContent" + element.timeLine;

    var currentFrame = $(frameBackground);
    var currentTitle = $(frameTitle);
    var currentContent = $(frameContent);

    currentFrame.attr("id", frameId);
    currentTitle.attr("id", titleId);
    currentContent.attr("id", contentId);

    currentFrame.children("img").css("display", "none");
    currentTitle.html(replaceLocal({name:"STARTCHANNEL"}));

    var appChannel = "";
    if(isJson(element.data)) {
        appChannel = JSON.parse(element.data)["app"];
    } else {
        appChannel = element.data;
    }
    

    var text = format(replaceLocal({name:"STARTCHANNELTEXT"}), true, element.channelName, appChannel, element.channelBound.width + " x " + element.channelBound.height);
    currentContent.append('<p>'+text+'</p>')

    $("#screenBackground").append(currentFrame);
    currentFrame.append(currentTitle);
    currentFrame.append(currentContent);

    displayPopUp(currentFrame, currentTitle, currentContent, 2);
    hidePopUp(currentFrame, currentTitle, currentContent);
}

export function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}