var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var app = require('../app');
var base = require('./baseAnimation');

export function implementAnimation(element) {
    var divId = "switchWindow" + element.timeLine;
    var frame = $(base.templateFrame);
    frame.attr("id", divId);
    frame.find('.popup').children("h2").append(app.replaceLocal({name:"WINDOWSWITCH"}));
    frame.find('.popup').children("img").attr("src", base.pathToAssets + "switch_windows.png");
    frame.find('.content').append('<p id="channelName"><span class="textBolder">'+app.replaceLocal({name:"VALUE"}) + ': </span>' + element.value +'</p>')
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