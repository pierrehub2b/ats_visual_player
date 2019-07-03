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

    frameContent.append("<span class='textBolder'>" + app.replaceLocal({name:"VALUE"}) + " 1:</span> " + element.data);
    frameContent.append('<p id="egal"><img src="assets/icons/32/equals.png" /></p>');
    frameContent.append("<span class='textBolder'>" + app.replaceLocal({name:"VALUE"}) + " 2: </span>" + element.data);

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.displayPopUp(frame, frameTitle, frameContent, 3);
    base.hidePopUp(frame, frameTitle, frameContent, 3);
}