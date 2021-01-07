import { calculPositions, setCurrentDragDropTimeline, box, createBox, previousMousePosition, pathToAssets52, hideBox } from './baseAnimation';
import $ from 'jquery';
import { timelLineLite } from '../uploader';

export function implementAnimation(element, frameCounter, isDrag) {
    if(frameCounter == 1) {
        implementAnimationStart(element, isDrag);
    } else {
        implementAnimationEnd(element, isDrag)
    }
}

export function implementAnimationStart(element, isDrag) {
    var frame = $("#pointerEvent");
    if(isDrag) {
        setCurrentDragDropTimeline(element.timeLine);
    }

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
        display: "flex",
        onComplete: function() { 
            if(isDrag) {
                frame.children("img").attr("src", pathToAssets52 + "mouse_select_left.png");
            } else {
                frame.children("img").attr("src", pathToAssets52 + "mouse.png");
            }
        }
    });
    previousMousePosition.x = positions.xMouse;
    previousMousePosition.y = positions.yMouse;
}

export function implementAnimationEnd(element, isDrag) {
    var frame = $("#pointerEvent");
    hideBox(element.timeLine ,0.2);
    if(!isDrag) {
        timelLineLite.to(frame, 1, {
            opacity: 0,
            display: "none"
        });
        setCurrentDragDropTimeline(null);
    }
}