import { replaceLocal } from './../app';
import { frameBackground, frameTitle, box, frameContent , format, calculPositions, createBox, displayPopUp, hidePopUp, hideBox } from './baseAnimation';
import $ from 'jquery';
import { timelLineLite } from '../uploader';

export function implementAnimation(element, frameCounter) {
    if(frameCounter ==1) {
        implementAnimationStart(element);
    } else {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element) {
    var frameId = "javascriptFrame" + element.timeLine;
    var titleId = "javascriptTitle" + element.timeLine;
    var contentId = "javascriptContent" + element.timeLine;

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
    currentTitle.html(replaceLocal({name:"JAVASCRIPTANIMATION"}));

    var text = format(replaceLocal({name:"JAVASCRIPTACTIONTEXT"}), true, element.element.tag, element.value);
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
}

export function implementAnimationEnd(element) {
    var frame = $("#javascriptFrame" + element.timeLine);
    var frameTitle = $("#javascriptTitle" + element.timeLine);
    var frameContent = $("#javascriptContent" + element.timeLine);
    hidePopUp(frame, frameTitle, frameContent, 4);
    hideBox(element.timeLine, 0.2);
}