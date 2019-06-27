var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element, frameCounter, isDrag) {
    if(frameCounter == 1) {
        implementAnimationStart(element, isDrag);
    } else {
        implementAnimationEnd(element)
    }
}

export function implementAnimationStart(element, isDrag) {
    var divId = "mouse" + element.timeLine;
    var frame = $(base.templateFrame);
    var box = $(base.box);
    box.attr("id", "box" + element.timeLine);
    frame.attr("id", divId); 
    frame.find('.popup').addClass("positioned");
    var imgPath = "drag_start.png";
    var localField = app.replaceLocal({name:"MOUSEDRAG"});
    if(!isDrag) {
        var imgPath = "drag_drop.png";   
        localField = app.replaceLocal({name:"MOUSEDROP"});
    }
    frame.find('.popup').children("h2").append(localField);
    frame.find('.popup').children("img").attr("src", base.pathToAssets + imgPath)
    
    frame.find('.content').append("<p><span class='textBolder'>" + app.replaceLocal({name:"CRITERIA"}) + ": </span>" + element.element.criterias + "</p>");
    frame.find('.content').append("<p><span class='textBolder'>" + app.replaceLocal({name:"ACTION"}) + ": </span>" + element.value + "</p>");
    frame.appendTo("#screenBackground");
    box.appendTo("#screenBackground");

    var positions = base.calculPositions(element);

    base.createBox(element.timeLine, positions.x,positions.y,element.element.bound.width * positions.ratio, element.element.bound.height * positions.ratio,0.2);
    timelLineLite.to(frame.children(".popup"), 0.5, {
        x: element.element.bound.x + element.element.bound.height,
        y: positions.yMouse + 40
    });
    timelLineLite.fromTo(frame, 0.5, {x:-$("#screenBackground").width()}, {
        x: 0,
        opacity: 1,
        display: "flex"
    });
}

export function implementAnimationEnd(element) {
    var divId = "#mouse" + element.timeLine;
    var frame = $(divId);
    
    timelLineLite.fromTo(frame, 0.5, {x:0}, {
        x:-$("#screenBackground").width(),
        opacity: 0,
        display: "none",
        delay: 2
    });
    timelLineLite.to(frame.children(".popup"), 0.5, {
        x: 0,
        y: 0
    });
    base.hideBox(element.timeLine, 0.2);
}