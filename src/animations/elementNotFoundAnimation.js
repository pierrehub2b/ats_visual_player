var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element) {
    var divId = "switchWindow" + element.timeLine;
    var frame = $(base.templateFrame);
    frame.attr("id", divId);
    frame.find('.popup').children("h3").append(app.replaceLocal({name:"ELEMENTNOTFOUND"}));
    frame.find('.popup').children("img").attr("src", base.pathToAssets + "warning.png");
    frame.find('.content').append("<p class='textBolder'>" + app.replaceLocal({name:"CRITERIA"}) + ": </p>");
    frame.find('.content').append("<p>" + element.element.criterias + "</p>");
    frame.appendTo("#screenBackground");

    timelLineLite.fromTo(frame, 0.5, {x:-$("#screenBackground").width()}, {
        x: 0,
        opacity: 1,
        display: "flex",
        delay: base.delay
    });
    timelLineLite.fromTo(frame, 0.5, {x:0}, {
        x:-$("#screenBackground").width(),
        opacity: 0,
        display: "none",
        delay: base.delay
    });
}