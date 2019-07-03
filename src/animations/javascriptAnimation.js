var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');

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

    frame.children("img").attr("src", base.pathToAssets + "javascript.png");
    frameTitle.html(app.replaceLocal({name:"JAVASCRIPTANIMATION"}));

    frameContent.append("<p><span class='textBolder'>" + app.replaceLocal({name:"CRITERIA"}) + ": </span>" + element.element.criterias + "</p>")
    frameContent.append("<p><span class='textBolder'>" + app.replaceLocal({name:"ACTION"}) + ": </span>" + element.value + "</p>")

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    base.displayPopUp(frame, frameTitle, frameContent, 3);
}

export function implementAnimationEnd(element) {
    var frame = $("#javascriptFrame" + element.timeLine);
    var frameTitle = $("#javascriptTitle" + element.timeLine);
    var frameContent = $("#javascriptContent" + element.timeLine);
    base.hidePopUp(frame, frameTitle, frameContent, 3);
    base.hideBox(element.timeLine, 0.2);
}