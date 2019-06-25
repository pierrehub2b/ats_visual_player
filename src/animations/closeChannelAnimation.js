var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var app = require('../app');
var base = require('./baseAnimation');

export var templateFrame = '<div class="overlay"><div class="popup"><h2></h2><div class="content">'+
'<p id="channelName"></p><p id="channelApplication"></p><p id="channelPosition"></p><p id="channelSize"></p></div></div></div>';

export function implementAnimation(element) {
    var divId = "stopChannel" + element.timeLine;
    var frame = $(base.templateFrame);
    frame.attr("id", divId);
    frame.find('.popup').children("h2").append(app.replaceLocal({name:"CLOSECHANNEL"}));
    frame.find('.popup').children("img").attr("src", base.pathToAssets + "layers_close.png");
    frame.find('.content').append('<p id="channelName"><span class="textBolder">'+app.replaceLocal({name:"CHANNELNAME"}) + ':</span> ' + element.channelName+'</p>')
    frame.find('.content').append('<p id="channelPosition"><span class="textBolder">'+app.replaceLocal({name:"CHANNELPOSITION"}) + ': </span>' + element.channelBound.x + " x " + element.channelBound.y +'</p>')
    frame.find('.content').append('<p id="channelSize"><span class="textBolder">'+app.replaceLocal({name:"CHANNELSIZE"}) + ':</span> ' + element.channelBound.width + " x " + element.channelBound.height +'</p>')
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