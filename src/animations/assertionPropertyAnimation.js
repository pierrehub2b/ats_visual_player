var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element) {
    var frameId = "propertyAssertionFrame" + element.timeLine;
    var titleId = "propertyAssertionTitle" + element.timeLine;
    var contentId = "propertyAssertionContent" + element.timeLine;

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

    frame.children("img").attr("src", base.pathToAssets + "check_property.png");
    frameTitle.html(app.replaceLocal({name:"ASSERTPROPERTY"}));

    var attr = element.value.split("=");
    var text = base.format(app.replaceLocal({name:"ASSERTTEXTPROPERTY"}), attr[0], element.element.tag, attr[attr.length-1], element.data);

    frameContent.append("<p>" + text + "</p>")

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    base.displayPopUp(frame, frameTitle, frameContent, 3);
    base.hidePopUp(frame, frameTitle, frameContent, 3);
    base.hideBox(element.timeLine, 0.2);
}