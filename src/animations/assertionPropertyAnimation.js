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
        if(element.error < 0) {
            outputStatus += app.replaceLocal({name:"ASSERTNOTVALID"}) + " ";
            outputStatus += app.replaceLocal({name:"REGULAREXPRESSION"}) + " <span class='animationVariable'>" + attr[1] + "</span>";
        } else {
            outputStatus += app.replaceLocal({name:"ASSERTVALID"}) + " " + app.replaceLocal({name:"REGULAREXPRESSION"});
        }
    } else {
        if(element.error < 0) {
            outputStatus += app.replaceLocal({name:"ISNOTEQUALS"}) + " à <span class='animationVariable'>" + attr[1] + "</span>";
        } else {
            outputStatus += app.replaceLocal({name:"ISEQUALS"}) + " à <span class='animationVariable'>" + attr[1] + "</span>";
        }
    }
//La comparaison de la propriété {0} sur le tag {1} a {2}:<br /> la valeur {} {3}
    var text = base.format(
        app.replaceLocal({name:"ASSERTPROPERTYTEXT"}), 
        true,
        attr[0],
        element.element.tag,
        (element.error < 0 ? "<span class='red'> " + app.replaceLocal({name:"ASSERTFAIL"}) : "<span class='green'> " + app.replaceLocal({name:"ASSERTSUCCESS"})) + "</span>", 
        "<span class='removeFormat'>" + outputStatus + "</span>"
    );

    frameContent.append("<p>" + text + "</p>")

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    base.displayPopUp(frame, frameTitle, frameContent, 2);
    base.hidePopUp(frame, frameTitle, frameContent, 4);
    base.hideBox(element.timeLine, 0.2);
}