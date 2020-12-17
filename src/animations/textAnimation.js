var $ = require('jquery');
import { timelLineLite } from '../uploader';
var base = require('./baseAnimation');

export function implementAnimation(element, frameCounter) {
    if(frameCounter == 1) {
        implementAnimationStart(element);
    } else if(frameCounter == 2) {
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

    timelLineLite.to(frame, 0, {
        onComplete: function() { 
            positions = base.calculPositions(element);

            var box = $("#box" + element.timeLine);
            box.css("width", positions.width + "px");
            box.css("height", positions.height + "px");
            box.css("left", positions.x + "px");
            box.css("top", positions.y + "px");

            textInput.css("width", positions.width + "px");
            textInput.css("height", positions.height + "px");
            textInput.css("left", positions.x + "px");
            textInput.css("top", positions.y + "px");
        
            frame.css("left", (positions.x + positions.width - positions.height - 5) + "px");
            frame.css("top", positions.y + "px");
            frame.children("img").css("width", positions.height + "px");
            frame.children("img").css("height", positions.height + "px");
        }
    });

    textInput.css("width", positions.width + "px");
    textInput.css("height", positions.height + "px");
    textInput.css("left", positions.x + "px");
    textInput.css("top", positions.y + "px");

    frame.css("left", (positions.x + (positions.width*0.8)) + "px");
    frame.css("top", positions.y + "px");
    frame.children("img").css("width", 3 + "px");
    frame.children("img").css("height", 3 + "px");

    timelLineLite.to(frame, 0, {
        onComplete: function() {
            textInput.html("");
        }
    });

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    timelLineLite.to(textInput, 0.2, {
        opacity: 1,
        display: "flex",
        delay: 0.5
    });
    timelLineLite.to(frame, 0.5, {
        opacity: 1,
        display: "flex"
    });

    var inputString = element.value;
    if(element.value && element.value.length > 50) {
        inputString = element.value.substring(0,45) + " ...";
    } 

    if(inputString) {
        for (let index = 0; index <= inputString.length; index++) {
            timelLineLite.to(textInput, 0.05, {
                onComplete: function() {
                    textInput.html(inputString.substring(0, index));
                }
            });
        }
    }
}

export function implementAnimationEnd(element) {
    var frame = $("#textEvent"+element.timeLine);
    var frameInput = $("#input"+element.timeLine);
    timelLineLite.to(frame, 0.5, {
        opacity: 0,
        display: "none"
    });
    timelLineLite.to(frameInput, 0.5, {
        opacity: 0,
        onComplete: function() { 
        }
    });
    base.hideBox(element.timeLine ,0.2);
}