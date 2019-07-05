var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var base = require('./baseAnimation');
import TextPlugin from "gsap/TextPlugin";

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
    var textInput = $(base.textInputAnimationFrame);
    //var clickAnim = $(base.clickEffectElement);
    frame.attr("id", divId);
    box.attr("id", "box" + element.timeLine);
    textInput.attr("id", "input" + element.timeLine);
    //clickAnim.attr("id", "click" + element.timeLine);

    textInput.appendTo("#screenBackground");
    box.appendTo("#screenBackground");
    frame.appendTo("#screenBackground");
    //clickAnim.appendTo("#screenBackground");

    var positions = base.calculPositions(element);

    textInput.css("width", positions.width + "vh");
    textInput.css("height", positions.height + "vh");
    textInput.css("left", positions.x + "vh");
    textInput.css("top", positions.y + "vh");

    frame.css("left", (positions.x + (positions.width*0.8)) + "vh");
    frame.css("top", positions.y + "vh");
    frame.children("img").css("width", 3 + "vh");
    frame.children("img").css("height", 3 + "vh");

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    timelLineLite.to(textInput, 0.2, {
        opacity: 1,
        display: "flex"
    });
    timelLineLite.to(frame, 0.5, {
        opacity: 1,
        display: "flex"
    });

    timelLineLite.to(textInput, 1, {text:element.value});
}

export function implementAnimationEnd(element) {
    var frame = $("#textEvent"+element.timeLine);
    var frameInput = $("#input"+element.timeLine);
    timelLineLite.to(frame, 0.5, {
        opacity: 0,
        display: "none"
    });
    timelLineLite.to(frameInput, 0.5, {
        opacity: 0
    });
    base.hideBox(element.timeLine ,0.2);
}