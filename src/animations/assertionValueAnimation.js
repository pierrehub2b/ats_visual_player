var $ = require('jQuery');
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element) {
    var frameId = "assertValueFrame" + element.timeLine;
    var titleId = "assertValueTitle" + element.timeLine;
    var contentId = "assertValueContent" + element.timeLine;
    
    var frame = $(base.frameBackground);
    var frameTitle = $(base.frameTitle);
    var frameContent = $(base.frameContent);

    frame.attr("id", frameId);
    frameTitle.attr("id", titleId);
    frameContent.attr("id", contentId);

    frame.children("img").attr("src", base.pathToAssets + "check_value.png");
    frameTitle.html(app.replaceLocal({name:"ASSERTVALUE"}));

    //ASSERTTEXTVALUE=La vérification de la valeur {0} a {1}. La valeur {2} {3} {4}
    var isRegex = false;  
    if(element.data.indexOf("regex") >= 0) {
        isRegex = true;
    }
    var text = base.format(
        app.replaceLocal({name:"ASSERTTEXTVALUE"}), 
        true, 
        element.value,
        (element.error < 0 ? "<span class='red'>" + app.replaceLocal({name:"ASSERTFAIL"}) : "<span class='green'>" + app.replaceLocal({name:"ASSERTSUCCESS"})) + "</span>",
        "<span class='removeFormat'>" + (element.error < 0 ? app.replaceLocal({name:"ASSERTNOTVALID"}) : app.replaceLocal({name:"ASSERTVALID"})) + "</span>",
        "<span class='removeFormat'>" + (isRegex ? app.replaceLocal({name:"REGULAREXPRESSION"}) : app.replaceLocal({name:"SEARCHEXPRESSION"})) + "</span>",
        isRegex ? element.data.split("->")[1]: element.value
    );

    frameContent.append("<p>" + text + "</p>")

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    base.displayPopUp(frame, frameTitle, frameContent, 2);
    base.hidePopUp(frame, frameTitle, frameContent, 4);
}