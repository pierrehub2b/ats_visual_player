var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var app = require('../app');
import { Ease, Elastic } from "gsap/TweenMax";

export var mousePointer = "<div class='pointerAction'><i class='fas fa-mouse-pointer'></i></div>";

export var templateFrame = '<div class="overlay"><div class="popup"><h2></h2><div class="content">'+
'<p id="channelName"></p><p id="channelApplication"></p><p id="channelPosition"></p><p id="channelSize"></p></div></div></div>';

export function implementAnimation(element) {
    var divId = "channelStart" + element.timeLine;
    var frame = $(mousePointer);
    frame.attr("id", divId);
    frame.appendTo("#screenBackground");

    //calcul position
    var ratio = $("#screenBackground").height() / element.channelBound.height;
    var clientWidth = element.channelBound.width*ratio;
    var origin = clientWidth - (clientWidth/2);
    var x = -origin + (element.element.bound.x*ratio) + element.element.bound.width/4;
    var y = element.element.bound.y*ratio + element.element.bound.height/4;

    timelLineLite.fromTo(frame, 0.5, {x: -$("#screenBackground").width(), x: -$("#screenBackground").height()}, {
        x: x, 
        y: y,
        opacity: 1,
        display: "flex",
        delay: 1
    });
    timelLineLite.to(frame, 0.2, {
        x: x+1, 
        y: y+1,
        delay: 0.2
    });
    //ajouter un effet sur le clic
    timelLineLite.to(frame, 0.2, {
        x: x, 
        y: y,
        delay: 0.2
    });
    timelLineLite.to(frame, 0.5, {
        x:-$("#screenBackground").width(),
        opacity: 0,
        display: "none",
        delay: 3
    });
}