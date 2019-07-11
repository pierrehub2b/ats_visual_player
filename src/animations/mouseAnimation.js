var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var app = require('../app');
var base = require('./baseAnimation');
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
        elemNotFound.implementAnimation(element, app.replaceLocal({name:"MOUSEACTION"}));
        return;
    }

    var frame = null;
    var divId = "mouseEvent" + element.timeLine;
    if(base.currentDragDropTimeline != null) {
        //drag and drop context
        frame = $("#mouseEvent" + base.currentDragDropTimeline);
    } else {
        frame = $(base.mousePointer);
        frame.attr("id", divId);
        frame.appendTo("#screenBackground");
    }

    
    var box = $(base.box);
    box.attr("id", "box" + element.timeLine);
    box.appendTo("#screenBackground");

    var positions = base.calculPositions(element);

    timelLineLite.to(frame, 0, {
        onComplete: function() { 
            positions = base.calculPositions(element);
            var box = $("#box" + element.timeLine);
            box.css("width", positions.width + "px");
            box.css("height", positions.height + "px");
            box.css("left", positions.x + "px");
            box.css("top", positions.y + "px");

            timelLineLite.fromTo(frame, 1, {top: base.previousMousePosition.y + "px", left: base.previousMousePosition.x + "px"}, {
                left: positions.xMouse + "px",
                top: positions.yMouse + "px",
                opacity: 1,
                display: "flex"
            }, divId);
            base.previousMousePosition.x = positions.xMouse;
            base.previousMousePosition.y = positions.yMouse;
        }
    });

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    timelLineLite.addLabel(divId);
    base.previousMousePosition.x = positions.xMouse;
    base.previousMousePosition.y = positions.yMouse;
}

export function implementAnimationEnd(element) {
    if(element.error < 0) {
        return;
    }
    base.hideBox(element.timeLine ,0.2);
    if(base.currentDragDropTimeline == null) {
        var divId = "#mouseEvent" + element.timeLine;
        var frame = $(divId);
        timelLineLite.to(frame, 0.5, {
            opacity: 0,
            display: "none"
        });
    }
}