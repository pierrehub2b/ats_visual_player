var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var app = require('../app');
import { Ease, Elastic } from "gsap/TweenMax";

export var templateFrame = '<div class="overlay"><div class="popup"><h2></h2><div class="content">'+
'<p id="channelName"></p><p id="channelApplication"></p><p id="channelPosition"></p><p id="channelSize"></p></div></div></div>';

export function implementAnimation(element) {
    var divId = "channelStart" + element.timeLine;
    var frame = $(templateFrame);
    frame.attr("id", divId);
    frame.find('.popup').children("h2").append(app.replaceLocal({name:"STARTCHANNEL"}) + ":");
    frame.find('.content').children("#channelName").append(app.replaceLocal({name:"CHANNELNAME"}) + ": " + element.channelName);
    frame.find('.content').children("#channelApplication").append(app.replaceLocal({name:"CHANNELAPPLICATION"}) + ": " + element.data);
    frame.find('.content').children("#channelPosition").append(app.replaceLocal({name:"CHANNELPOSITION"}) + ": " + element.channelBound.x + " x " + element.channelBound.y);
    frame.find('.content').children("#channelSize").append(app.replaceLocal({name:"CHANNELSIZE"}) + ": " + element.channelBound.width + " x " + element.channelBound.height);
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