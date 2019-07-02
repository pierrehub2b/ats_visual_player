var $ = require('jQuery');
import { timelLineLite } from '../uploader';
var base = require('./baseAnimation');

export function implementAnimation(element, frameCounter) {
    if(frameCounter ==1) {
        implementAnimationStart(element);
    } else if(frameCounter == 2){
        implementAnimationIntermediaire(element);
    } else {
        implementAnimationEnd(element);
    }
}

export function implementAnimationStart(element) {
    var divId = "scrollEvent" + element.timeLine;
    var frame = $(base.arrowUp);
    frame.attr("id", divId);
    frame.appendTo("#screenBackground");

    if(element.element.vpos == 'bottom' || element.value > 0) {
        frame.children("img").attr("src", base.arrowDown);
    }

    timelLineLite.fromTo(frame, 0.5, {
        opacity: 0,
        display: "flex",
        x: 0,
        y: $("#screenBackground").height() / 2,
    },
    {
        opacity: 1,
        repeat:5,
    });
}

export function implementAnimationIntermediaire(element) {
    // var divId = "#scrollEvent" + element.timeLine;
    // var frame = $(divId);
    // timelLineLite.fromTo(frame, 0.5, {
    //     opacity: 0,
    //     display: "flex",
    //     x: 0,
    //     y: $("#screenBackground").height() / 2,
    // },
    // {
    //     opacity: 1,
    //     repeat:5,
    // });
}

export function implementAnimationEnd(element) {
    var divId = "#scrollEvent" + element.timeLine;
    var frame = $(divId);

    timelLineLite.to(frame, 0.2, {
        opacity: 0
    });
}