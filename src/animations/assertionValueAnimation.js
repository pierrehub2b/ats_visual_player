var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element) {
    var frameId = "assertValueFrame" + element.timeLine;
    var titleId = "assertValueTitle" + element.timeLine;
    var contentId = "assertValueContent" + element.timeLine;
    
    var frame = $(base.frameBackground);
    var frameTitle = $(base.frameTitle);
    var frameContent = $(base.frameContent);

    frame.attr("id", frameId);
    frameTitle.attr("id", titleId);
    frameContent.attr("id", contentId);

    frame.children("img").attr("src", base.pathToAssets + "check_value.png");
    frameTitle.html(app.replaceLocal({name:"ASSERTVALUE"}));

    var text = base.format(app.replaceLocal({name:"ASSERTTEXTVALUE"}), element.value, element.data, element.data);

    frameContent.append("<p>" + text + "</p>")

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.displayPopUp(frame, frameTitle, frameContent, 1);
    base.hidePopUp(frame, frameTitle, frameContent, 4);
}