var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element, frameCounter) {
    if(frameCounter == 1) {
        implementAnimationStart(element);
    } else {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element) {
    var frameId = "goToUrlFrame" + element.timeLine;
    var titleId = "goToUrlTitle" + element.timeLine;
    var contentId = "goToUrlContent" + element.timeLine;
    
    var frame = $(base.frameBackground);
    var frameTitle = $(base.frameTitle);
    var frameContent = $(base.frameContent);

    frame.attr("id", frameId);
    frameTitle.attr("id", titleId);
    frameContent.attr("id", contentId);

    frame.children("img").attr("src", base.pathToAssets + "link_go.png");
    frameTitle.html(app.replaceLocal({name:"GOTOURL"}));

    var text = base.format(app.replaceLocal({name:"GOTOURLTEXT"}), true, element.value);
    frameContent.append("<p>" + text + "</p>");

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.displayPopUp(frame, frameTitle, frameContent, 1);
}

export function implementAnimationEnd(element) {
    var frame = $("#goToUrlFrame" + element.timeLine);
    var frameTitle = $("#goToUrlTitle" + element.timeLine);
    var frameContent = $("#goToUrlContent" + element.timeLine);
    base.hidePopUp(frame, frameTitle, frameContent);
}