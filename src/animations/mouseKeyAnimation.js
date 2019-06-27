var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var base = require('./baseAnimation');

export function implementAnimation(element) {
    var divId = "pointerEvent" + element.timeLine;
    var frame = $(base.mousePointer);
    var box = $(base.box);
    var clickAnim = $(base.clickEffectElement);
    frame.attr("id", divId);
    box.attr("id", "box" + element.timeLine);
    clickAnim.attr("id", "click" + element.timeLine);
    frame.appendTo("#screenBackground");
    box.appendTo("#screenBackground");
    clickAnim.appendTo("#screenBackground");

    var positions = base.calculPositions(element);

    timelLineLite.fromTo(frame, 0.5, {y: base.previousMousePosition.y, x: base.previousMousePosition}, {
        x: positions.xMouse, 
        y: positions.yMouse,
        opacity: 1,
        display: "flex"
    });
    base.createBox(element.timeLine, positions.x,positions.y,element.element.bound.width * positions.ratio, element.element.bound.height * positions.ratio,0.2);
    timelLineLite.to(frame, 0.2, {
        x: positions.xMouse + 2, 
        y: positions.yMouse + 2,
    });
    base.clickAnimation(element.timeLine, positions.xMouse,positions.yMouse);
    timelLineLite.to(frame, 0.2, {
        x: positions.xMouse, 
        y: positions.yMouse,
    });
    base.hideBox(element.timeLine ,0.2);
    timelLineLite.to(frame, 0.5, {
        opacity: 0,
        display: "none"
    });
    base.previousMousePosition.x = positions.xMouse;
    base.previousMousePosition.y = positions.yMouse;
}