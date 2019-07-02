var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element) {
    var divId = "assertValue" + element.timeLine;
    var frame = $(base.templateFrame);
    frame.attr("id", divId);
    frame.find('.popup').children("h3").append(app.replaceLocal({name:"ASSERTVALUE"}));
    frame.find('.popup').children("img").attr("src", base.pathToAssets + "check_value.png")
    frame.find('.content').append("<span class='textBolder'>" + app.replaceLocal({name:"VALUE"}) + " 1:</span> " + element.data);
    frame.find('.content').append('<p id="egal"><img src="assets/icons/32/equals.png" /></p>')
    frame.find('.content').append("<span class='textBolder'>" + app.replaceLocal({name:"VALUE"}) + " 2: </span>" + element.data);
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