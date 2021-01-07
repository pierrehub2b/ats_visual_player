import { replaceLocal } from './../app';
import { previousMousePosition, currentDragDropTimeline, box, calculPositions, createBox, hideBox } from './baseAnimation';
import $ from 'jquery';
import { implementNotFoundAnimation } from './elementNotFoundAnimation';
import { timelLineLite } from '../uploader';

export function implementAnimation(element, frameCounter) {
    if(frameCounter ==1) {
        implementAnimationStart(element);
    } else {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element) {
    if(element.error < 0) {
        implementNotFoundAnimation(element, replaceLocal({name:"MOUSEACTION"}));
        return;
    }

    var frame = null;
    frame = $("#pointerEvent");
    
    var currentBox = $(box);
    currentBox.attr("id", "box" + element.timeLine);
    currentBox.appendTo("#screenBackground");

    var positions = calculPositions(element);

    timelLineLite.to(frame, 0, {
        onComplete: function() { 
            positions = calculPositions(element);
            var currentBox = $("#box" + element.timeLine);
            currentBox.css("width", positions.width + "px");
            currentBox.css("height", positions.height + "px");
            currentBox.css("left", positions.x + "px");
            currentBox.css("top", positions.y + "px");

            frame.css("left", positions.xMouse + "px");
            frame.css("top", positions.yMouse + "px");
        }
    });

    createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    timelLineLite.fromTo(frame, 1, {top: previousMousePosition.y + "px", left: previousMousePosition.x + "px"}, {
        opacity: 1,
        display: "flex"
    });
    previousMousePosition.x = positions.xMouse;
    previousMousePosition.y = positions.yMouse;
}

export function implementAnimationEnd(element) {
    if(element.error < 0) {
        return;
    }
    hideBox(element.timeLine ,0.2);
    if(currentDragDropTimeline == null) {
        var frame = $("#pointerEvent");
        timelLineLite.to(frame, 0.5, {
            opacity: 0,
            display: "none"
        });
    }
}