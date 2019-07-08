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

    var isRegex = false;  
    if(element.value.indexOf("match") >= 0) {
        isRegex = true;
    }

    var attr = element.value.split("=");
    var outputStatus = "";
    if(isRegex) {
        attr = element.value.split(" match ");
        if(element.error == -1) {
            outputStatus += app.replaceLocal({name:"ASSERTNOTVALID"}) + " ";
        } else {
            outputStatus += app.replaceLocal({name:"ASSERTVALID"}) + " ";
        }
        outputStatus += app.replaceLocal({name:"REGULAREXPRESSION"});
    } else {
        if(element.error == -1) {
            outputStatus += app.replaceLocal({name:"ISNOTEQUALS"}) + " à";
        } else {
            outputStatus += app.replaceLocal({name:"ISEQUALS"}) + " à";
        }
    }

    var text = base.format(
        app.replaceLocal({name:"ASSERTPROPERTYTEXT"}), 
        true,
        attr[0], 
        (element.error == -1 ? "<span class='red'> " + app.replaceLocal({name:"ASSERTFAIL"}) : "<span class='green'> " + app.replaceLocal({name:"ASSERTSUCCESS"})) + "</span>", 
        "<span class='removeFormat'>" + outputStatus + "</span>",
        attr[1]
    );

    frameContent.append("<p>" + text + "</p>")

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    base.displayPopUp(frame, frameTitle, frameContent, 1);
    base.hidePopUp(frame, frameTitle, frameContent, 4);
    base.hideBox(element.timeLine, 0.2);
}