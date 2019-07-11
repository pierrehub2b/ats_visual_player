var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');
import { timelLineLite } from '../uploader';
import { AttrPlugin } from "gsap/AttrPlugin";

export function implementAnimation(element, frameCounter, isDrag, imgId) {
    if(frameCounter == 1) {
        implementAnimationStart(element, isDrag, imgId);
    } else {
        implementAnimationEnd(element, isDrag)
    }
}

export function implementAnimationStart(element, isDrag, imgId) {
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

    var positions = base.calculPositions(element, imgId);

    timelLineLite.to(frame, 0, {
        onComplete: function() { 
            positions = base.calculPositions(element, imgId);

            var box = $("#box" + element.timeLine);
            box.css("width", positions.width + "px");
            box.css("height", positions.height + "px");
            box.css("left", positions.x + "px");
            box.css("top", positions.y + "px");

            timelLineLite.fromTo(frame, 1, {top: base.previousMousePosition.y + "px", left: base.previousMousePosition.x + "px"}, {
                left: positions.xMouse + "px",
                top: positions.yMouse + "px",
                opacity: 1,
                display: "flex",
                onComplete: function() { 
                    if(isDrag) {
                        frame.children("img").attr("src", base.pathToAssets + "mouse_select_left.png");
                    } else {
                        frame.children("img").attr("src", base.pathToAssets + "mouse.png");
                    }
                }
            }, imgId);
            base.previousMousePosition.x = positions.xMouse;
            base.previousMousePosition.y = positions.yMouse;
        }
    });

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    timelLineLite.addLabel(imgId);
    base.previousMousePosition.x = positions.xMouse;
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