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
    var frame = null;
    var frame = $("#pointerEvent");
    
    var box = $(base.box);
    box.attr("id", "box" + element.timeLine);
    box.appendTo("#screenBackground");

    var clickAnim = $(base.clickEffectElement);
    frame.children("img").attr("src", base.pathToAssets52 + "mouse_select_left.png");
    
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
            positions = base.calculPositions(element);
            var box = $("#box" + element.timeLine);
            box.css("width", positions.width + "px");
            box.css("height", positions.height + "px");
            box.css("left", positions.x + "px");
            box.css("top", positions.y + "px");

            frame.css("left", positions.xMouse + "px");
            frame.css("top", positions.yMouse + "px");

            var click = $("#click" + element.timeLine);
            click.css("left", (positions.xMouse + 13) + "px");
            click.css("top", positions.yMouse + "px");
        }
    });
    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    timelLineLite.to(frame , 1, /*{top: base.previousMousePosition.y + "px", left: base.previousMousePosition.x + "px"}, */{
        opacity: 1,
        display: "flex"
    });
    base.clickAnimation(element.timeLine, positions.xMouse + 13,positions.yMouse);

    base.previousMousePosition.x = positions.xMouse;
    base.previousMousePosition.y = positions.yMouse;
}

export function implementAnimationEnd(element) {
    if(element.error < 0) {
        return;
    }
    var frame = $("#pointerEvent");

    base.hideBox(element.timeLine ,0.2);
    timelLineLite.to(frame, 0.5, {
        opacity: 0,
        display: "none"
    });
}