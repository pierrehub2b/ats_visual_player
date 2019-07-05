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

    var crit = element.element.criterias.split(",");
    var text = base.format(app.replaceLocal({name:"ELEMENTNOTFOUNDTEXT"}), crit[0], crit[1]); 
    frameContent.append("<p>" + text + "</p>");

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.displayPopUp(frame, frameTitle, frameContent, 3);
    base.hidePopUp(frame, frameTitle, frameContent, 3);
}