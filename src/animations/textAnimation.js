var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var base = require('./baseAnimation');

export function implementAnimation(element, frameCounter) {
    if(frameCounter ==1) {
        implementAnimationStart(element);
    } else {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element) {
    var divId = "textEvent" + element.timeLine;
    var frame = $(base.keyboardPointer);
    var box = $(base.box);
    //var clickAnim = $(base.clickEffectElement);
    frame.attr("id", divId);
    box.attr("id", "box" + element.timeLine);
    //clickAnim.attr("id", "click" + element.timeLine);
    frame.appendTo("#screenBackground");
    box.appendTo("#screenBackground");
    //clickAnim.appendTo("#screenBackground");

    var positions = base.calculPositions(element);

    frame.css("left", positions.xMouse + "%");
    frame.css("top", positions.yMouse + "%");

    timelLineLite.to(frame, 0.5, {
        opacity: 1,
        display: "flex"
    });
    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
}

export function implementAnimationEnd(element) {
    var frame = $("#textEvent"+element.timeLine);
    base.hideBox(element.timeLine ,0.2);
    timelLineLite.to(frame, 0.5, {
        opacity: 0,
        display: "none",
        delay: base.delay
    });
}