var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element) {
    var divId = "propertyAssertion" + element.timeLine;
    var frame = $(base.templateFrame);
    var box = $(base.box);
    box.attr("id", "box" + element.timeLine);
    frame.attr("id", divId);
    frame.find('.popup').children("h2").append(app.replaceLocal({name:"ASSERTPROPERTY"}));
    frame.find('.popup').addClass("positioned");
    frame.find('.popup').children("img").attr("src", base.pathToAssets + "check_property.png")
    frame.find('.content').append("<p><span class='textBolder'>" + app.replaceLocal({name:"ELEMENT"}) + ": </span>" + element.value + "</p>");
    frame.find('.content').append('<p id="egal"><i class="fas fa-equals"></i></p>')
    frame.find('.content').append("<p><span class='textBolder'>" + app.replaceLocal({name:"VALUE"}) + ": </span>" + element.data + "</p>");
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