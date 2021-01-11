import { replaceLocal } from './../app';
import { frameBackground, frameTitle, box, frameContent, pathToAssets32 , format, calculPositions, createBox, displayPopUp, hidePopUp, hideBox } from './baseAnimation';
import $ from 'jquery';
import { timelLineLite } from '../uploader';

export function implementAnimation(element) {
    var frameId = "propertyAssertionFrame" + element.timeLine;
    var titleId = "propertyAssertionTitle" + element.timeLine;
    var contentId = "propertyAssertionContent" + element.timeLine;

    var currentBox = $(box);
    currentBox.attr("id", "box" + element.timeLine);
    currentBox.appendTo("#screenBackground");

    var currentFrame = $(frameBackground);
    var currentTitle = $(frameTitle);
    var currentContent = $(frameContent);

    var positions = calculPositions(element);

    currentFrame.attr("id", frameId);
    currentTitle.attr("id", titleId);
    currentContent.attr("id", contentId);

    currentFrame.children("img").attr("src", pathToAssets32 + "check_value.png");
    if(element.error < 0) {
        currentFrame.children("img").attr("src", pathToAssets32 + "error.png");
    }
    currentTitle.html(replaceLocal({name:"ASSERTPROPERTY"}));

    var isRegex = false;  
    if(element.value.indexOf("match") >= 0) {
        isRegex = true;
    }

    var attr = element.value.split("=");
    var outputStatus = "";
    if(isRegex) {
        attr = element.value.split(" match ");
        if(element.error < 0) {
            outputStatus += replaceLocal({name:"ASSERTNOTVALID"}) + " ";
            outputStatus += replaceLocal({name:"REGULAREXPRESSION"}) + " <span class='animationVariable'>" + attr[attr.length-1] + "</span>";
        } else {
            outputStatus += replaceLocal({name:"ASSERTVALID"}) + " " + replaceLocal({name:"REGULAREXPRESSION"});
        }
    } else {
        if(element.error < 0) {
            outputStatus += replaceLocal({name:"ISNOTEQUALS"}) + " à <span class='animationVariable'>" + attr[attr.length-1] + "</span>";
        } else {
            outputStatus += replaceLocal({name:"ISEQUALS"}) + " à <span class='animationVariable'>" + attr[attr.length-1] + "</span>";
        }
    }
//La comparaison de la propriété {0} sur le tag {1} a {2}:<br /> la valeur {} {3}
    var text = format(
        replaceLocal({name:"ASSERTPROPERTYTEXT"}), 
        true,
        attr[0],
        element.element.tag,
        (element.error < 0 ? "<span class='red'> " + replaceLocal({name:"ASSERTFAIL"}) : "<span class='green'> " + replaceLocal({name:"ASSERTSUCCESS"})) + "</span>", 
        "<span class='removeFormat'>" + outputStatus + "</span>"
    );

    currentContent.append("<p>" + text + "</p>")

    $("#screenBackground").append(currentFrame);
    currentFrame.append(currentTitle);
    currentFrame.append(currentContent);

    timelLineLite.to(currentFrame, 0, {
        onComplete: function() { 
            positions = calculPositions(element);
            var currentBox = $("#box" + element.timeLine);
            currentBox.css("width", positions.width + "px");
            currentBox.css("height", positions.height + "px");
            currentBox.css("left", positions.x + "px");
            currentBox.css("top", positions.y + "px");
        }
    });

    createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    displayPopUp(currentFrame, currentTitle, currentContent, 2);
    hidePopUp(currentFrame, currentTitle, currentContent, 4);
    hideBox(element.timeLine, 0.2);
}