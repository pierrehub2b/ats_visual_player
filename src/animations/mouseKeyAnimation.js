var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var base = require('./baseAnimation');
var app = require('../app');
var elemNotFound = require('./elementNotFoundAnimation');

export function implementAnimation(element, frameCounter) {
    if(frameCounter ==1) {
        implementAnimationStart(element);
    } else {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element) {
    if(element.error < 0) {
        elemNotFound.implementAnimation(element, app.replaceLocal({name:"CLICKMOUSE"}));
        return;
    }
    var divId = "pointerEvent" + element.timeLine;
    var frame = $(base.mousePointer);
    
    var box = $(base.box);
    box.attr("id", "box" + element.timeLine);
    box.appendTo("#screenBackground");

    var clickAnim = $(base.clickEffectElement);
    frame.attr("id", divId);
    
    clickAnim.attr("id", "click" + element.timeLine);
    frame.appendTo("#screenBackground");
    clickAnim.appendTo("#screenBackground");

    var positions = base.calculPositions(element);

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    timelLineLite.fromTo(frame, 1, {top: base.previousMousePosition.y + "vh", left: base.previousMousePosition.x + "%"}, {
        left: 50 - positions.xMouse + "%",
        top: positions.yMouse + "vh",
        opacity: 1,
        display: "flex",
        onComplete: function() { 
            if(isDrag) {
                frame.children("img").attr("src", base.pathToAssets + "mouse_select_left.png");
            } else {
                frame.children("img").attr("src", base.pathToAssets + "mouse.png");
            }
        }
    });
    base.clickAnimation(element.timeLine, positions.xMouse,positions.yMouse-1);
    base.previousMousePosition.x = 50 - positions.xMouse;
    base.previousMousePosition.y = positions.yMouse;
}

export function implementAnimationEnd(element) {
    if(element.error < 0) {
        return;
    }
    var divId = "#pointerEvent" + element.timeLine;
    var frame = $(divId);

    base.hideBox(element.timeLine ,0.2);
    timelLineLite.to(frame, 0.5, {
        opacity: 0,
        display: "none"
    });
}