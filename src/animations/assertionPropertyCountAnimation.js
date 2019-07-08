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
        case ">":
            opText = app.replaceLocal({name:"SUPERIOR"});
            break;
        case "<":
            opText = app.replaceLocal({name:"INFERIOR"});
            break;
    }
    //la vérification de {0} a {2}: {3} élément(s) {4} ayant les critères recherchés ont été trouvés
    var text = base.format(
        app.replaceLocal({name:"ASSERTPROPERTYCOUNTTEXT"}),
        true,
        "<span class='removeFormat'>" + (element.value > 0 ? app.replaceLocal({name:"ASSERTCOUNTFOUNDED"}) : app.replaceLocal({name:"ASSERTCOUNTNOTFOUNDED"})) + "</span>",
        element.value > 0 ? element.value + " " + base.plurialManagement(app.replaceLocal({name:"ELEMENTS"}), element.value == 1) : "",
        opText,
        (element.error == -1 ? "<span class='red'>" + app.replaceLocal({name:"ASSERTFAIL"}) : "<span class='green'>" + app.replaceLocal({name:"ASSERTSUCCESS"})) + "</span>", 
        element.value == 0 ? app.replaceLocal({name:"NONE"}) : element.value,
        "<span class='removeFormat'>" + base.plurialManagement(app.replaceLocal({name:"ELEMENTS"}), element.value == 1) + "</span>",
        crit[0]);

    frameContent.append("<p>" + text + "</p>")

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    base.displayPopUp(frame, frameTitle, frameContent, 1);
    base.hidePopUp(frame, frameTitle, frameContent, 5);
    base.hideBox(element.timeLine, 0.2);
}