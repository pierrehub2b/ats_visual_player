var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var base = require('./baseAnimation');

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

    timelLineLite.fromTo(frame, 0.5, {y: $("#screenBackground").height()}, {
        x: positions.xMouse, 
        y: positions.yMouse + element.element.bound.height * positions.ratio,
        opacity: 1,
        display: "flex"
    });
    base.createBox(element.timeLine, positions.x,positions.y,element.element.bound.width * positions.ratio, element.element.bound.height * positions.ratio, 0.2);
}

export function implementAnimationEnd(element) {
    var frame = $("#textEvent"+element.timeLine);
    base.hideBox(element.timeLine ,0.2);
    timelLineLite.to(frame, 0.5, {
        y: $("#screenBackground").height() ,
        opacity: 0,
        display: "none"
    });
}