var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element, frameCounter, isDrag) {
    if(frameCounter == 1) {
        implementAnimationStart(element, isDrag);
    } else {
        implementAnimationEnd(element)
    }
}

export function implementAnimationStart(element, isDrag) {
    var frameId = "mouseFrame" + element.timeLine;
    var titleId = "mouseTitle" + element.timeLine;
    var contentId = "mouseContent" + element.timeLine;

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

    var imgPath = "drag_start.png";
    var localField = app.replaceLocal({name:"MOUSEDRAG"});
    if(!isDrag) {
        var imgPath = "drag_drop.png";   
        localField = app.replaceLocal({name:"MOUSEDROP"});
    }
    frame.children("img").attr("src", base.pathToAssets + imgPath);
    frameTitle.html(localField);

    frameContent.append("<p><span class='textBolder'>" + app.replaceLocal({name:"CRITERIA"}) + ": </span>" + element.element.criterias + "</p>")
    frameContent.append("<p><span class='textBolder'>" + app.replaceLocal({name:"ACTION"}) + ": </span>" + element.value + "</p>")

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    base.displayPopUp(frame, frameTitle, frameContent, 3);

}

export function implementAnimationEnd(element) {
    var frame = $("#mouseFrame" + element.timeLine);
    var frameTitle = $("#mouseTitle" + element.timeLine);
    var frameContent = $("#mouseContent" + element.timeLine);
    
    base.hidePopUp(frame, frameTitle, frameContent, 3);
    base.hideBox(element.timeLine, 0.2);
}