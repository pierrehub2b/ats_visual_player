var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var app = require('../app');
import { TimelineMax, TweenMax } from "gsap/TweenMax";

export var templateFrame = '<div class="overlay"><div class="popup"><h2>Démarrage d\'un channel:</h2><div class="content"></div></div></div>';

export function implementAnimation(element) {
    var divId = "channelStart" + element.timeLine;
    var frame = $(templateFrame);
    frame.attr("id", divId);
    frame.find('.content').html(element.data);
    frame.appendTo("#screenBackground");
    timelLineLite.to(frame, 0.5, {
        opacity: 1,
        display: "flex",
        delay: 1.5
    });
    timelLineLite.to(frame, 0.5, {
        opacity: 0,
        display: "none",
        delay: 1.5
    });
}