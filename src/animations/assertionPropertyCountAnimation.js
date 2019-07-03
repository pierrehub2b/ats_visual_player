var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element) {
    var frameId = "propertyCountAssertionFrame" + element.timeLine;
    var titleId = "propertyCountAssertionTitle" + element.timeLine;
    var contentId = "propertyCountAssertionContent" + element.timeLine;

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

    frame.children("img").attr("src", base.pathToAssets + "occurence.png");
    frameTitle.html(app.replaceLocal({name:"ASSERTCOUNT"}));

    frameContent.append("<p class='textBolder'>" + app.replaceLocal({name:"CRITERIA"}) + ": </p>")
    frameContent.append("<p>" + element.element.criterias + "</p>")
    frameContent.append("<p><span class='textBolder'>" + app.replaceLocal({name:"EXPECTEDRESULT"}) + "</span>" + element.data + "</p>")
    frameContent.append("<p><span class='textBolder'>" + app.replaceLocal({name:"OCCURENCEFOUNDED"}) + ":</span> " + element.value + "</p>")

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    base.displayPopUp(frame, frameTitle, frameContent, 3);
    base.hidePopUp(frame, frameTitle, frameContent, 3);
    base.hideBox(element.timeLine, 0.2);
}