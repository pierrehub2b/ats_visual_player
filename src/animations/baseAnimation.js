var $ = require('jQuery');
import { timelLineLite } from '../uploader';

export var pathToAssets = "./assets/icons/32/";
export var box = '<div class="box"><span id="left-side"></span><span id="top-side"></span><span id="right-side"></span><span id="bottom-side"></span></div>';
export var clickEffectElement = '<div class="circle"><div class="inner"></div></div>';
export var frameBackground = '<div class="popupFrame"><img class="imgFrame" /></div>';
export var frameTitle = '<h3 class="popupTitle"></h3>';
export var frameContent = '<div class="popupContent"></div>';
export var mousePointer = "<div class='pointerAction'><img class='animationImg' src='"+pathToAssets+"mouse.png' /></div>";
export var keyboardPointer = "<div class='pointerAction'><img class='animationImg' src='"+pathToAssets+"keyboard.png' /></div>";
export var textInputAnimationFrame = "<div class='textInputAnimation'></div>";
export var arrowUp = "<div class='pointerAction'><img class='animationImg' src='"+pathToAssets+"up.png' /></div>";
export var arrowDown = ""+pathToAssets+"down.png";
export var defaultDelay = 4;
export var currentDragDropTimeline = null;

export function setCurrentDragDropTimeline(val) {
    currentDragDropTimeline = val;
}

export var previousMousePosition = {x: 0, y: $("#screenBackground").height()};
export var borderSize = 3;

export function format(fmt, withSpan, ...args) {
    if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
        throw new Error('invalid format string.');
    }
    return fmt.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
        if (str) {
            return str.replace(/(?:{{)|(?:}})/g, m => m[0]);
        } else {
            if (index >= args.length) {
                throw new Error('argument index is out of range in format');
            }
            if(withSpan) {
                return "<span class='animationVariable'>" + args[index] + "</span>";
            }
            return args[index];
        }
    });
}

export function plurialManagement(str, isSingular) {
    return str.replace("(s)", isSingular ? "": "s");
}

export function calculPositions(element, imgId) {
    var frame = document.getElementById(imgId);
    var ratio       = $("#screenBackground").height() / element.channelBound.height;
    // var offsetLeft  = ($("#screenBackground").width() - (element.channelBound.height * ratio)) / 2;
    var ratioWidth  = element.element.bound.width * ratio;
    var ratioHeight = element.element.bound.height * ratio;
    var ratioX      = element.element.bound.x * ratio;
    var ratioY      = element.element.bound.y * ratio;

    var x = frame.offsetLeft + ratioX - (ratio * 10);
    var y = ratioY - (ratio * 10);

    var xMouse = x + (ratioWidth / 4);
    var yMouse = y + (ratioHeight / 4);

    if(element.element.vposValue != 0) {
        switch(element.element.vpos) {
            case "top":
                yMouse = y + (element.element.vposValue * ratio);
                break;
            case "bottom":
                yMouse = y + ratioHeight - (element.element.vposValue * ratio);
                break;
        }
    }

    if(element.element.hposValue != 0) {
        switch(element.element.hpos) {
            case "left":
                xMouse = x + (element.element.hposValue * ratio);
                break;
            case "right":
                xMouse = x + ratioWidth - (element.element.hposValue * ratio);
                break;
        }
    }

    return {x: x, y:y, xMouse: xMouse, yMouse:yMouse, width: ratioWidth, height: ratioHeight};


    // var screenHeight = $("#screenBackground").height()
    // var screenWidth = $("#screenBackground").width() - 10;
    // var ratio = screenHeight / element.channelBound.height;
    // var ratioW = screenWidth / element.channelBound.width;

    // var channelWidthBound = element.channelBound.width * ratio;
    // var xBound = element.element.bound.x * ratio;
    // var widthBound = element.element.bound.width * ratio;

    // var xRelativeToCenter = (((channelWidthBound/2) - xBound) / screenWidth) * (ratioW * 100);
    
    // var yMouse = (((element.element.bound.y * ratio) + ((element.element.bound.height / 2) * ratio)) / screenHeight) * 100;
    // var xMouse = xRelativeToCenter - (((widthBound/2) / screenWidth) * 100);

    // // Mouse calculation depends of vpos and hpos 
    // if(element.element.vposValue != 0) {
    //     switch(element.element.vpos) {
    //         case "top":
    //             yMouse = ((((element.element.bound.y + element.element.vposValue) * ratio)) / screenHeight) * 100;
    //             break;
    //         case "bottom":
    //             yMouse = ((((element.element.bound.y + element.element.bound.height - element.element.vposValue) * ratio)) / screenHeight) * 100;
    //             break;
    //     }
    // }

    // if(element.element.hposValue != 0) {
    //     switch(element.element.hpos) {
    //         case "left":
    //             xMouse = xRelativeToCenter - (((element.element.hposValue * ratio) / screenWidth) * 100);
    //             break;
    //         case "right":
    //             xMouse = xRelativeToCenter - ((widthBound - (element.element.hposValue * ratio)) / screenWidth) * 100;
    //             break;
    //     }
    // }

    // var x = xRelativeToCenter;
    // var y = (((element.element.bound.y * ratio) / screenHeight) * 100);

    // var elementWidth = ((element.element.bound.width * ratio) / screenHeight) * 100;
    // var elementHeight = ((element.element.bound.height * ratio) / screenHeight) * 100;

    // x = x < 0 ? 0 : x;
    // y = y < 0 ? 0 : y;
    // xMouse = xMouse < 0 ? 0 : xMouse;
    // yMouse = yMouse < 0 ? 0 : yMouse;
}

export function createBox(id, x,y, width, height, duration) { 
    var box = $("#box" + id);
    box.css("width", width + "px");
    box.css("height", height + "px");
    box.css("left", x + "px");
    box.css("top", y + "px");
    var top = box.children("#top-side");
    var bottom = box.children("#bottom-side");
    var left = box.children("#left-side");
    var right = box.children("#right-side");

    // top
    timelLineLite.fromTo(top, duration, 
        {
            width: 0, 
            height: borderSize,
            immediateRender: false,
            autoRound: false,
            ease: Power0.easeNone,
            delay: 1
        }, 
        {
            width: '100%'
        }
    );

    // right
    timelLineLite.fromTo(right, duration, 
        {
            height: 0, 
            width: borderSize,
            immediateRender: false,
            autoRound: false,
            ease: Power0.easeNone
        }, 
        {
            height: '100%'
        }
    );

    // bottom
    timelLineLite.fromTo(bottom, duration, 
        {
            width: 0, 
            height: borderSize,
            immediateRender: false,
            autoRound: false,
            ease: Power0.easeNone
        }, 
        {
            width: '100%'
        }
    );

    // left
    timelLineLite.fromTo(left, duration, 
        {
            height: 0,
            immediateRender: false,
            width: borderSize,
            autoRound: false,
            ease: Power0.easeNone
        }, 
        {
            height: '100%'
        }
    );
};

export function hideBox(id, duration) { 
    var box = $("#box" + id);
    var top = box.children("#top-side");
    var bottom = box.children("#bottom-side");
    var left = box.children("#left-side");
    var right = box.children("#right-side");

    // left
    timelLineLite.to(left, duration, 
        {
            height: 0, 
            immediateRender: false,
            width: borderSize,
            autoRound: false,
            ease: Power0.easeNone,
            delay: 1
        }
    );

        // bottom
        timelLineLite.to(bottom, duration, 
            {
                width: 0, 
                height: borderSize,
                immediateRender: false,
                autoRound: false,
                ease: Power0.easeNone
            }
        );

        // right
        timelLineLite.to(right, duration, 
            {
                height: 0, 
                width: borderSize,
                immediateRender: false,
                autoRound: false,
                ease: Power0.easeNone
            }
        );

        // top
        timelLineLite.to(top, duration, 
            {
                width: 0, 
                height: borderSize,
                immediateRender: false,
                autoRound: false,
                ease: Power0.easeNone
            }
        );
};

export function clickAnimation(id, x,y, imgId) {
    var click = $("#click" + id);
    click.css("left", x + "px");
    click.css("top", y + "px");
    timelLineLite.fromTo(click, 0.2, 
        {
            immediateRender: false,
            autoRound: false,
            ease: Power0.easeNone,
            opacity: 0
        },
        {
            opacity: 0.8,
            width: 25,
            height: 25
        }, imgId + "-1"
    );
    timelLineLite.to(click, 0.2, 
        {
            opacity: 0
        }, imgId + "-2"
    );
}

export function displayPopUp(frame, title, content, delay) {
    var d = delay ? delay : defaultDelay;
    timelLineLite.fromTo(frame, 0.5, {xPercent: -200}, {
        xPercent: 0,
        opacity: 0.9,
        display: "flex",
        delay: d
    });

    timelLineLite.fromTo(content, 0.3, {xPercent: -200}, {
        xPercent: 2,
        opacity: 1,
        display: "flex"
    });

    timelLineLite.fromTo(title, 0.3, {xPercent: -200}, {
        xPercent: 4,
        opacity: 1,
        display: "flex"
    });
}

export function hidePopUp(frame, title, content, delay) {
    var d = delay ? delay : defaultDelay;
    timelLineLite.to(title, 0.2, {
        xPercent: -200,
        opacity: 0,
        display: "flex",
        delay: d
    });

    timelLineLite.to(content, 0.2, {
        xPercent: -200,
        opacity: 0,
        display: "flex"
    });

    timelLineLite.to(frame, 0.2, {
        xPercent: -200,
        opacity: 0,
        display: "flex"
    });
}