var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');
import { timelLineLite } from '../uploader';
import { AttrPlugin } from "gsap/AttrPlugin";

export function implementAnimation(element, frameCounter, isDrag) {
    if(frameCounter == 1) {
        implementAnimationStart(element, isDrag);
    } else {
        implementAnimationEnd(element, isDrag)
    }
}

export function implementAnimationStart(element, isDrag) {
    var frame = null;
    if(isDrag) {
        base.setCurrentDragDropTimeline(element.timeLine);
        var divId = "mouseEvent" + element.timeLine;
        frame = $(base.mousePointer);
        frame.attr("id", divId);
        frame.appendTo("#screenBackground");
    } else {
        frame = $("#mouseEvent" + base.currentDragDropTimeline);
    }

    var box = $(base.box);
    box.attr("id", "box" + element.timeLine);
    box.appendTo("#screenBackground");

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
    base.previousMousePosition.x = 50 - positions.xMouse;
    base.previousMousePosition.y = positions.yMouse;
}

export function implementAnimationEnd(element, isDrag) {
    var divId = "#mouseEvent" + base.currentDragDropTimeline;
    var frame = $(divId);
    base.hideBox(element.timeLine ,0.2);
    if(!isDrag) {
        timelLineLite.to(frame, 1, {
            opacity: 0,
            display: "none"
        });
        base.setCurrentDragDropTimeline(null);
    }
}