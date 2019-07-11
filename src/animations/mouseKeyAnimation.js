var $ = require('jQuery');
import { timelLineLite } from '../uploader';
import { TweenLite } from 'gsap/TweenMax';
var base = require('./baseAnimation');
var app = require('../app');
var elemNotFound = require('./elementNotFoundAnimation');

export function implementAnimation(element, frameCounter, imgId) {
    if(frameCounter ==1) {
        implementAnimationStart(element, imgId);
    } else {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element, imgId) {
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

    var positions = base.calculPositions(element, imgId);

    timelLineLite.to(frame, 0, {
        onComplete: function() { 
            positions = base.calculPositions(element, imgId);
            var box = $("#box" + element.timeLine);
            box.css("width", positions.width + "px");
            box.css("height", positions.height + "px");
            box.css("left", positions.x + "px");
            box.css("top", positions.y + "px");

            var click = $("#click" + element.timeLine);
            click.css("left", positions.x + "px");
            click.css("top", positions.y + "px");

            timelLineLite.fromTo(frame, 1, {top: base.previousMousePosition.y + "px", left: base.previousMousePosition.x + "px"}, {
                left: positions.xMouse + "px",
                top: positions.yMouse + "px",
                opacity: 1,
                display: "flex"
            }, imgId);
            base.clickAnimation(element.timeLine, positions.xMouse,positions.yMouse-1, imgId);
        }
    });

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    timelLineLite.addLabel(imgId);
    timelLineLite.addLabel(imgId + "-1");
    timelLineLite.addLabel(imgId + "-2");
    base.previousMousePosition.x = positions.xMouse;
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