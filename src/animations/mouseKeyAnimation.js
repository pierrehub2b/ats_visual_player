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
    if(element.error == -1) {
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

    var clickPositionX = (positions.xMouse + 1);
    var clickPositionY = (positions.yMouse - 2);

    frame.css("left", clickPositionX + "vh");
    frame.css("top", clickPositionY + "vh");

    timelLineLite.fromTo(frame, 0.5, {top: base.previousMousePosition.y + "vh", left: base.previousMousePosition.x + "vh"}, {
        left: clickPositionX + "vh",
        top: clickPositionY + "vh",
        opacity: 1,
        display: "flex"
    });
    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    base.clickAnimation(element.timeLine, clickPositionX,clickPositionY-1);
    base.previousMousePosition.x = clickPositionX;
    base.previousMousePosition.y = clickPositionY;
}

export function implementAnimationEnd(element) {
    if(element.error == -1) {
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