import { keyboardPointer, box, textInputAnimationFrame, calculPositions, createBox, hideBox } from './baseAnimation';
import $ from 'jquery';
import { timelLineLite } from '../uploader';

export function implementAnimation(element, frameCounter) {
    if(frameCounter == 1) {
        implementAnimationStart(element);
    } else if(frameCounter == 2) {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element) {
    var divId = "textEvent" + element.timeLine;
    var currentBox = $(box);
    var currentPointer = $(keyboardPointer);
    var currentTextAnimation = $(textInputAnimationFrame);


    //var clickAnim = $(clickEffectElement);
    currentPointer.attr("id", divId);
    currentBox.attr("id", "box" + element.timeLine);
    currentTextAnimation.attr("id", "input" + element.timeLine);
    //clickAnim.attr("id", "click" + element.timeLine);

    currentTextAnimation.appendTo("#screenBackground");
    currentBox.appendTo("#screenBackground");
    currentPointer.appendTo("#screenBackground");
    //clickAnim.appendTo("#screenBackground");

    var positions = calculPositions(element);

    timelLineLite.to(currentPointer, 0, {
        onComplete: function() { 
            positions = calculPositions(element);

            var currentBox = $("#box" + element.timeLine);
            currentBox.css("width", positions.width + "px");
            currentBox.css("height", positions.height + "px");
            currentBox.css("left", positions.x + "px");
            currentBox.css("top", positions.y + "px");

            currentTextAnimation.css("width", positions.width + "px");
            currentTextAnimation.css("height", positions.height + "px");
            currentTextAnimation.css("left", positions.x + "px");
            currentTextAnimation.css("top", positions.y + "px");
        
            currentPointer.css("left", (positions.x + positions.width - positions.height - 5) + "px");
            currentPointer.css("top", positions.y + "px");
            currentPointer.children("img").css("width", positions.height + "px");
            currentPointer.children("img").css("height", positions.height + "px");
        }
    });

    currentTextAnimation.css("width", positions.width + "px");
    currentTextAnimation.css("height", positions.height + "px");
    currentTextAnimation.css("left", positions.x + "px");
    currentTextAnimation.css("top", positions.y + "px");

    currentPointer.css("left", (positions.x + (positions.width*0.8)) + "px");
    currentPointer.css("top", positions.y + "px");
    currentPointer.children("img").css("width", 3 + "px");
    currentPointer.children("img").css("height", 3 + "px");

    timelLineLite.to(currentPointer, 0, {
        onComplete: function() {
            currentTextAnimation.html("");
        }
    });

    createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    timelLineLite.to(currentTextAnimation, 0.2, {
        opacity: 1,
        display: "flex",
        delay: 0.5
    });
    timelLineLite.to($(keyboardPointer), 0.5, {
        opacity: 1,
        display: "flex"
    });

    var inputString = element.value;
    if(element.value && element.value.length > 50) {
        inputString = element.value.substring(0,45) + " ...";
    } 

    if(inputString) {
        for (let index = 0; index <= inputString.length; index++) {
            timelLineLite.to(currentTextAnimation, 0.05, {
                onComplete: function() {
                    currentTextAnimation.html(inputString.substring(0, index));
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
    hideBox(element.timeLine ,0.2);
}