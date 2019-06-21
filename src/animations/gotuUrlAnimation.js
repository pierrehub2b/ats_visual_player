var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var app = require('../app');
import { TimelineMax, TweenMax } from "gsap/TweenMax";

export var templateFrame = '<div class="overlay"><div class="popup"><h2></h2><div class="content"></div></div></div>';

export function implementAnimation(element) {
    var divId = "goToUrl" + element.timeLine;
    var frame = $(templateFrame);
    frame.attr("id", divId);
    frame.find('.popup').children("h2").append(app.replaceLocal({name:"GOTOURL"}) + ":");
    frame.find('.content').append(app.replaceLocal({name:"URLLABEL"}) + ": " + element.value);
    frame.appendTo("#screenBackground");
    timelLineLite.fromTo(frame, 0.5, {x:-$("#screenBackground").width()}, {
        x: 0,
        opacity: 1,
        display: "flex",
        delay: 1
    });
    timelLineLite.fromTo(frame, 0.5, {x:0}, {
        x:-$("#screenBackground").width(),
        opacity: 0,
        display: "none",
        delay: 3
    });
}