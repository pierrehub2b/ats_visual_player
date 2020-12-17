var $ = require('jquery');
import { timelLineLite } from '../uploader';
var app = require('../app');
var base = require('./baseAnimation');
var elemNotFound = require('./elementNotFoundAnimation');

export function implementAnimation(element) {
    if(element.error < 0) {
        elemNotFound.implementAnimation(element, app.replaceLocal({name:"GETPROPERTY"}));
        return;
    }
    var frameId = "propertyFrame" + element.timeLine;
    var titleId = "propertyTitle" + element.timeLine;
    var contentId = "propertyContent" + element.timeLine;

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

    frame.children("img").css("display", "none");
    frameTitle.html(app.replaceLocal({name:"GETPROPERTY"}));
    
    var text = base.format(app.replaceLocal({name:"PROPERTYTEXT"}), true, element.value, element.element.tag, element.data );
    frameContent.append('<p>'+text+'</p>')

    $("#screenBackground").append(frame);
    frame.append(frameTitle);
    frame.append(frameContent);

    timelLineLite.to(frame, 0, {
        onComplete: function() { 
            positions = base.calculPositions(element);
            var box = $("#box" + element.timeLine);
            box.css("width", positions.width + "px");
            box.css("height", positions.height + "px");
            box.css("left", positions.x + "px");
            box.css("top", positions.y + "px");
        }
    });

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    base.displayPopUp(frame, frameTitle, frameContent, 2);
    base.hidePopUp(frame, frameTitle, frameContent, 4);
    base.hideBox(element.timeLine, 0.2);
}