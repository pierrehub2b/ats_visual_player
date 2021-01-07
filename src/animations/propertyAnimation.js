import { replaceLocal } from './../app';
import { format, frameBackground, frameContent, frameTitle, box, calculPositions, createBox, displayPopUp, hideBox, hidePopUp } from './baseAnimation';
import $ from 'jquery';
import { implementNotFoundAnimation } from './elementNotFoundAnimation';
import { timelLineLite } from '../uploader';

export function implementAnimation(element) {
    if(element.error < 0) {
        implementNotFoundAnimation(element, replaceLocal({name:"GETPROPERTY"}));
        return;
    }
    var frameId = "propertyFrame" + element.timeLine;
    var titleId = "propertyTitle" + element.timeLine;
    var contentId = "propertyContent" + element.timeLine;

    var currentFrame = $(frameBackground);
    var currentTitle = $(frameTitle);
    var currentContent = $(frameContent);

    var currentBox = $(box);
    currentBox.attr("id", "box" + element.timeLine);
    currentBox.appendTo("#screenBackground");

    var positions = calculPositions(element);

    currentFrame.attr("id", frameId);
    currentTitle.attr("id", titleId);
    currentContent.attr("id", contentId);

    currentFrame.children("img").css("display", "none");
    currentTitle.html(replaceLocal({name:"GETPROPERTY"}));
    
    var text = format(replaceLocal({name:"PROPERTYTEXT"}), true, element.value, element.element.tag, element.data );
    currentContent.append('<p>'+text+'</p>')

    $("#screenBackground").append(currentFrame);
    currentFrame.append(currentTitle);
    currentFrame.append(currentContent);

    timelLineLite.to(currentFrame, 0, {
        onComplete: function() { 
            positions = calculPositions(element);
            var currentBox = $("#box" + element.timeLine);
            currentBox.css("width", positions.width + "px");
            currentBox.css("height", positions.height + "px");
            currentBox.css("left", positions.x + "px");
            currentBox.css("top", positions.y + "px");
        }
    });

    createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    displayPopUp(currentFrame, currentTitle, currentContent, 2);
    hidePopUp(currentFrame, currentTitle, currentContent, 4);
    hideBox(element.timeLine, 0.2);
}