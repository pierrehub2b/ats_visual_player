var $ = require('jQuery');
import { timelLineLite } from '../uploader';
import { TimelineMax, TweenMax } from "gsap/TweenMax";

export var templateFrame = '<div class="overlay"><div class="popup"><h2>Navigation vers:</h2><div class="content"></div></div></div>';

export function implementAnimation(element) {
    var divId = "goToUrl" + element.timeLine;
    var frame = $(templateFrame);
    frame.attr("id", divId);
    frame.find('.content').html(element.value);
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