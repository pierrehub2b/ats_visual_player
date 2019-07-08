var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element) {
    var frameId = "commentFrame" + element.timeLine;
    var titleId = "commentTitle" + element.timeLine;
    var contentId = "commentContent" + element.timeLine;
    
    var frame = $(base.frameBackground);
    var frameTitle = $(base.frameTitle);
    var frameContent = $(base.frameContent);

    frame.attr("id", frameId);
    frameTitle.attr("id", titleId);
    frameContent.attr("id", contentId);

    frame.children("img").attr("src", base.pathToAssets + "comment.png");
    frameTitle.html(app.replaceLocal({name:"COMMENT"}));

    var text = base.format(app.replaceLocal({name:"COMMENTACTIONTEXT"}), true, element.data);
    frameContent.append('<p>'+text+'</p>')

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);
    base.displayPopUp(frame, frameTitle, frameContent, 1);
    base.hidePopUp(frame, frameTitle, frameContent);
}