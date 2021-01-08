import { replaceLocal } from './../app';
import { frameBackground, frameTitle, frameContent, format, displayPopUp, hidePopUp, pathToAssets32 } from './baseAnimation';
import $ from 'jquery';

export function implementNotFoundAnimation(element, type) {
    var frameId = "elementNotFoundFrame" + element.timeLine;
    var titleId = "elementNotFoundTitle" + element.timeLine;
    var contentId = "elementNotFoundContent" + element.timeLine;

    var currentFrame = $(frameBackground);
    var currentTitle = $(frameTitle);
    var currentContent = $(frameContent);

    currentFrame.attr("id", frameId);
    currentTitle.attr("id", titleId);
    currentContent.attr("id", contentId);

    currentFrame.children("img").attr("src", pathToAssets32 + "warning.png");
    currentTitle.html(replaceLocal({name:"ELEMENTNOTFOUND"}));

    var crit = element.element.criterias.split(",");
    var text = format(replaceLocal({name:"ELEMENTNOTFOUNDTEXT"}), true, type, crit[0], crit[1]); 
    currentContent.append("<p>" + text + "</p>");

    $("#screenBackground").append(currentFrame);
    currentFrame.append(currentTitle);
    currentFrame.append(currentContent);

    displayPopUp(currentFrame, currentTitle, currentContent, 2);
    hidePopUp(currentFrame, currentTitle, currentContent);
}