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
    frame.find('.popup').children("h3").append(app.replaceLocal({name:"ASSERTPROPERTY"}));
    frame.find('.popup').addClass("positioned");
    frame.find('.popup').children("img").attr("src", base.pathToAssets + "check_property.png")
    frame.find('.content').append("<p><span class='textBolder'>" + app.replaceLocal({name:"ELEMENT"}) + ": </span>" + element.value + "</p>");
    frame.find('.content').append('<p id="egal"><img src="assets/icons/32/equals.png" /></p>')
    frame.find('.content').append("<p><span class='textBolder'>" + app.replaceLocal({name:"VALUE"}) + ": </span>" + element.data + "</p>");
    frame.appendTo("#screenBackground");
    box.appendTo("#screenBackground");

    var positions = base.calculPositions(element);

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    timelLineLite.fromTo(frame, 0.5, {top: "50%", left: "0%"}, {
        left: positions.xMouse + "%",
        top: positions.yMouse + 2 + "%",
        opacity: 1,
        display: "flex"
    });
    timelLineLite.to(frame, 0.5, {
        opacity: 0,
        display: "none",
        delay: base.delay
    });
    base.hideBox(element.timeLine, 0.2);
}