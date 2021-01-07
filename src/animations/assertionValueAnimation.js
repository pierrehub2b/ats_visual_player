import { replaceLocal } from './../app';
import { frameBackground, frameTitle, frameContent, pathToAssets32 , format, displayPopUp, hidePopUp } from './baseAnimation';
import $ from 'jquery';

export function implementAnimation(element) {
    var frameId = "assertValueFrame" + element.timeLine;
    var titleId = "assertValueTitle" + element.timeLine;
    var contentId = "assertValueContent" + element.timeLine;

    var currentFrame = $(frameBackground);
    var currentTitle = $(frameTitle);
    var currentContent = $(frameContent);

    currentFrame.attr("id", frameId);
    currentTitle.attr("id", titleId);
    currentContent.attr("id", contentId);

    currentFrame.children("img").attr("src", pathToAssets32 + "check_value.png");
    if(element.error < 0) {
        currentFrame.children("img").attr("src", pathToAssets32 + "error.png");
    }
    currentTitle.html(replaceLocal({name:"ASSERTVALUE"}));

    //ASSERTTEXTVALUE=La vérification de la valeur {0} a {1}. La valeur {2} {3} {4}
    var isRegex = false;  
    if(element.data.indexOf("regex") >= 0) {
        isRegex = true;
    }
    var text = format(
        replaceLocal({name:"ASSERTTEXTVALUE"}), 
        true, 
        element.value,
        (element.error < 0 ? "<span class='red'>" + replaceLocal({name:"ASSERTFAIL"}) : "<span class='green'>" + replaceLocal({name:"ASSERTSUCCESS"})) + "</span>",
        "<span class='removeFormat'>" + (element.error < 0 ? replaceLocal({name:"ASSERTNOTVALID"}) : replaceLocal({name:"ASSERTVALID"})) + "</span>",
        "<span class='removeFormat'>" + (isRegex ? replaceLocal({name:"REGULAREXPRESSION"}) : replaceLocal({name:"SEARCHEXPRESSION"})) + "</span>",
        isRegex ? element.data.split("->")[1]: element.value
    );

    currentContent.append("<p>" + text + "</p>")

    $("#screenBackground").append(currentFrame);
    currentFrame.append(currentTitle);
    currentFrame.append(currentContent);

    displayPopUp(currentFrame, currentTitle, currentContent, 2);
    hidePopUp(currentFrame, currentTitle, currentContent, 4);
}