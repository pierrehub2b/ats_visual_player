var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');
import { timelLineLite } from '../uploader';

export function implementAnimation(element, imgId) {
    var frameId = "propertyCountAssertionFrame" + element.timeLine;
    var titleId = "propertyCountAssertionTitle" + element.timeLine;
    var contentId = "propertyCountAssertionContent" + element.timeLine;

    var box = $(base.box);
    box.attr("id", "box" + element.timeLine);
    box.appendTo("#screenBackground");

    var positions = base.calculPositions(element, imgId);
    
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

    //ASSERTPROPERTYCOUNTTEXT=La vérification de {0} {1} {2} a {3}:<br /> {4} {5} {6} {7}

    var text = base.format(
        app.replaceLocal({name:"ASSERTPROPERTYCOUNTTEXT"}),
        true,
        element.value > 0 ? app.replaceLocal({name:"ASSERTCOUNTFOUNDED"}) : app.replaceLocal({name:"ASSERTCOUNTNOTFOUNDED"}),
        element.value > 0 ? element.value + " " + base.plurialManagement(app.replaceLocal({name:"ELEMENTS"}), element.value == 1) : "",
        opText,
        (element.error < 0 ? "<span class='red'>" + app.replaceLocal({name:"ASSERTFAIL"}) : "<span class='green'>" + app.replaceLocal({name:"ASSERTSUCCESS"})) + "</span>", 
        element.value == 0 ? app.replaceLocal({name:"NONE"}) : element.value,
        "<span class='removeFormat'>" + base.plurialManagement(app.replaceLocal({name:"ELEMENTS"}), element.value == 1) + "</span>",
        crit[0],
        element.error < 0 ?
            (
                "<span class='removeFormat'>" + (element.value == 1 ? 
                    app.replaceLocal({name:"ISNOTFOUND"}) + " " + app.replaceLocal({name:"ONCRITERIA"})
                    :
                    app.replaceLocal({name:"ARENOTFOUND"}) + " " + app.replaceLocal({name:"ONCRITERIA"})
                ) + "</span><span class='animationVariable'>" + crit[1] + "</span>"
            )
            :
            (
                "<span class='removeFormat'>" + (element.value == 1 ? 
                    app.replaceLocal({name:"ISFOUND"})
                    :
                    (element.value == 0 ? 
                        app.replaceLocal({name:"ISNOTFOUND"})
                        :
                        app.replaceLocal({name:"AREFOUND"})
                    )
                ) + "</span>"
            )
    );

    frameContent.append("<p>" + text + "</p>")

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    timelLineLite.to(frame, 0, {
        onComplete: function() { 
            positions = base.calculPositions(element, imgId);
            var box = $("#box" + element.timeLine);
            box.css("width", positions.width + "px");
            box.css("height", positions.height + "px");
            box.css("left", positions.x + "px");
            box.css("top", positions.y + "px");
        }
    });

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    base.displayPopUp(frame, frameTitle, frameContent, 2);
    base.hidePopUp(frame, frameTitle, frameContent, 5);
    base.hideBox(element.timeLine, 0.2);
}