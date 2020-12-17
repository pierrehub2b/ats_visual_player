var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');
import { timelLineLite } from '../uploader';

export function implementAnimation(element, frameCounter) {
    if(frameCounter ==1) {
        implementAnimationStart(element);
    } else {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element) {
    var frameId = "javascriptFrame" + element.timeLine;
    var titleId = "javascriptTitle" + element.timeLine;
    var contentId = "javascriptContent" + element.timeLine;

    var box = $(base.box);
    box.attr("id", "box" + element.timeLine);
    box.appendTo("#screenBackground");

    var positions = base.calculPositions(element);
    
    var frame = $(base.frameBackground);
    var frameTitle = $(base.frameTitle);
    var frameContent = $(base.frameContent);

    frame.attr("id", frameId);
    frameTitle.attr("id", titleId);
    frameContent.attr("id", contentId);

    frame.children("img").css("display", "none");
    frameTitle.html(app.replaceLocal({name:"JAVASCRIPTANIMATION"}));

    var text = base.format(app.replaceLocal({name:"JAVASCRIPTACTIONTEXT"}), true, element.element.tag, element.value);
    frameContent.append('<p>'+text+'</p>')

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    timelLineLite.to(frame, 0, {
        onComplete: function() { 
            positions = base.calculPositions(element);
            var box = $("#box" + element.timeLine);
            box.css("width", positions.width + "px");
            box.css("height", positions.height + "px");
            box.css("left", positions.x + "px");
            box.css("top", positions.y + "px");
        }
    });

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    base.displayPopUp(frame, frameTitle, frameContent, 2);
}

export function implementAnimationEnd(element) {
    var frame = $("#javascriptFrame" + element.timeLine);
    var frameTitle = $("#javascriptTitle" + element.timeLine);
    var frameContent = $("#javascriptContent" + element.timeLine);
    base.hidePopUp(frame, frameTitle, frameContent, 4);
    base.hideBox(element.timeLine, 0.2);
}