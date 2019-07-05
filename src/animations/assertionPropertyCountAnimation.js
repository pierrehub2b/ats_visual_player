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

var crit = element.element.criterias.split(",");
    var operator = element.data.split(" ");
    var opText = "";
    switch(operator[0]) {
        case "=":
            opText = app.replaceLocal({name:"EQUAL"});
            break;
        case ">":
            opText = app.replaceLocal({name:"SUPERIOR"});
            break;
        case "<":
            opText = app.replaceLocal({name:"INFERIOR"});
            break;
    }
    var text = base.format(app.replaceLocal({name:"ASSERTPROPERTYCOUNTTEXT"}), element.element.tag, crit[1], opText, operator[1], element.value);
    frameContent.append("<p>" + text + "</p>")

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    base.displayPopUp(frame, frameTitle, frameContent, 3);
    base.hidePopUp(frame, frameTitle, frameContent, 3);
    base.hideBox(element.timeLine, 0.2);
}