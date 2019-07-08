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

    var text = base.format(app.replaceLocal({name:"JAVASCRIPTACTIONTEXT"}), true, element.element.tag, element.value);
    frameContent.append('<p>'+text+'</p>')

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    base.displayPopUp(frame, frameTitle, frameContent, 1);
}

export function implementAnimationEnd(element) {
    var frame = $("#javascriptFrame" + element.timeLine);
    var frameTitle = $("#javascriptTitle" + element.timeLine);
    var frameContent = $("#javascriptContent" + element.timeLine);
    base.hidePopUp(frame, frameTitle, frameContent, 4);
    base.hideBox(element.timeLine, 0.2);
}