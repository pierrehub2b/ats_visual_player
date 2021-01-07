import { replaceLocal } from './../app';
import { frameBackground, plurialManagement, frameTitle, frameContent, pathToAssets32 , box, format, calculPositions, createBox, displayPopUp, hidePopUp, hideBox } from './baseAnimation';
import $ from 'jquery';
import { timelLineLite } from '../uploader';

export function implementAnimation(element) {
    var frameId = "propertyCountAssertionFrame" + element.timeLine;
    var titleId = "propertyCountAssertionTitle" + element.timeLine;
    var contentId = "propertyCountAssertionContent" + element.timeLine;

    var currentFrame = $(frameBackground);
    var currentTitle = $(frameTitle);
    var currentContent = $(frameContent);

    var currentBox = $(box);
    currentBox.attr("id", "box" + element.timeLine);
    currentBox.appendTo("#screenBackground");

    var positions = calculPositions(element);

    currentFrame.attr("id", frameId);
    currentTitle.attr("id", titleId);
    currentContent.attr("id", contentId);

    currentFrame.children("img").attr("src", pathToAssets32 + "check_value.png");
    if(element.error < 0) {
        currentFrame.children("img").attr("src", pathToAssets32 + "error.png");
    }
    currentTitle.html(replaceLocal({name:"ASSERTCOUNT"}));

    var crit = element.element.criterias.split(",");
    var operator = element.data.split(" ");
    var opText = "";
    switch(operator[0]) {
        case ">":
            opText = replaceLocal({name:"SUPERIOR"});
            break;
        case "<":
            opText = replaceLocal({name:"INFERIOR"});
            break;
    }

    //ASSERTPROPERTYCOUNTTEXT=La vérification de {0} {1} {2} a {3}:<br /> {4} {5} {6} {7}

    var text = format(
        replaceLocal({name:"ASSERTPROPERTYCOUNTTEXT"}),
        true,
        element.value > 0 ? replaceLocal({name:"ASSERTCOUNTFOUNDED"}) : replaceLocal({name:"ASSERTCOUNTNOTFOUNDED"}),
        element.value > 0 ? element.value + " " + plurialManagement(replaceLocal({name:"ELEMENTS"}), element.value == 1) : "",
        opText,
        (element.error < 0 ? "<span class='red'>" +replaceLocal({name:"ASSERTFAIL"}) : "<span class='green'>" + replaceLocal({name:"ASSERTSUCCESS"})) + "</span>", 
        element.value == 0 ? replaceLocal({name:"NONE"}) : element.value,
        "<span class='removeFormat'>" + plurialManagement(replaceLocal({name:"ELEMENTS"}), element.value == 1) + "</span>",
        crit[0],
        element.error < 0 ?
            (
                "<span class='removeFormat'>" + (element.value == 1 ? 
                    replaceLocal({name:"ISNOTFOUND"}) + " " + replaceLocal({name:"ONCRITERIA"})
                    :
                    replaceLocal({name:"ARENOTFOUND"}) + " " + replaceLocal({name:"ONCRITERIA"})
                ) + "</span><span class='animationVariable'>" + crit[1] + "</span>"
            )
            :
            (
                "<span class='removeFormat'>" + (element.value == 1 ? 
                    replaceLocal({name:"ISFOUND"})
                    :
                    (element.value == 0 ? 
                        replaceLocal({name:"ISNOTFOUND"})
                        :
                        replaceLocal({name:"AREFOUND"})
                    )
                ) + "</span>"
            )
    );

    currentContent.append("<p>" + text + "</p>")

    $("#screenBackground").append(currentFrame);
    currentFrame.append(currentTitle);
    currentFrame.append(currentContent);

    timelLineLite.to(currentFrame, 0, {
        onComplete: function() { 
            positions = calculPositions(element);
            var box = $("#box" + element.timeLine);
            box.css("width", positions.width + "px");
            box.css("height", positions.height + "px");
            box.css("left", positions.x + "px");
            box.css("top", positions.y + "px");
        }
    });

    createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    displayPopUp(currentFrame, currentTitle, currentContent, 2);
    hidePopUp(currentFrame, currentTitle, currentContent, 5);
    hideBox(element.timeLine, 0.2);
}