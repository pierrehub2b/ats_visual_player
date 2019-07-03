var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element) {
    var frameId = "elementNotFoundFrame" + element.timeLine;
    var titleId = "elementNotFoundTitle" + element.timeLine;
    var contentId = "elementNotFoundContent" + element.timeLine;
    
    var frame = $(base.frameBackground);
    var frameTitle = $(base.frameTitle);
    var frameContent = $(base.frameContent);

    frame.attr("id", frameId);
    frameTitle.attr("id", titleId);
    frameContent.attr("id", contentId);

    frame.children("img").attr("src", base.pathToAssets + "warning.png");
    frameTitle.html(app.replaceLocal({name:"ELEMENTNOTFOUND"}));

    frameContent.append("<p class='textBolder'>" + app.replaceLocal({name:"CRITERIA"}) + ": </p>");
    frameContent.append("<p>" + element.element.criterias + "</p>");

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.displayPopUp(frame, frameTitle, frameContent, 3);
    base.hidePopUp(frame, frameTitle, frameContent, 3);
}