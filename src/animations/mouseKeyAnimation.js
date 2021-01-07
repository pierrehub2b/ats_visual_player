import { replaceLocal } from './../app';
import { previousMousePosition, box, clickEffectElement, pathToAssets52, calculPositions, createBox, clickAnimation, hideBox } from './baseAnimation';
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
        implementNotFoundAnimation(element, replaceLocal({name:"CLICKMOUSE"}));
        return;
    }
    var frame = null;
    var frame = $("#pointerEvent");
    
    var currentBox = $(box);
    currentBox.attr("id", "box" + element.timeLine);
    currentBox.appendTo("#screenBackground");

    var clickAnim = $(clickEffectElement);
    frame.children("img").attr("src", pathToAssets52 + "mouse_select_left.png");
    
    clickAnim.attr("id", "click" + element.timeLine);
    clickAnim.appendTo("#screenBackground");

    var positions = {
        x: 0,
        y: 0,
        xMouse: 0,
        yMouse: 0,
        width: 0,
        height: 0
    }

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

            var click = $("#click" + element.timeLine);
            click.css("left", (positions.xMouse + 13) + "px");
            click.css("top", positions.yMouse + "px");
        }
    });
    createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    timelLineLite.to(frame , 1, /*{top: previousMousePosition.y + "px", left: previousMousePosition.x + "px"}, */{
        opacity: 1,
        display: "flex"
    });
    clickAnimation(element.timeLine, positions.xMouse + 13,positions.yMouse);

    previousMousePosition.x = positions.xMouse;
    previousMousePosition.y = positions.yMouse;
}

export function implementAnimationEnd(element) {
    if(element.error < 0) {
        return;
    }
    var frame = $("#pointerEvent");

    hideBox(element.timeLine ,0.2);
    timelLineLite.to(frame, 0.5, {
        opacity: 0,
        display: "none"
    });
}