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
export var defaultDelay = 3;

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

export function calculPositions(element) {
    var screenHeight = $("#screenBackground").height()
    var screenWidth = $("#screenBackground").width() - 10; // 10 = panelSeparator
    var ratio = screenHeight / element.channelBound.height;
    var imgClientWidth = element.channelBound.width * ratio;
    var leftDistance = (screenWidth - imgClientWidth) / 2;

    var x = (((element.element.bound.x * ratio) + leftDistance) / screenHeight) * 100;
    var y = (((element.element.bound.y * ratio) / screenHeight) * 100);

    var xMouse = (((element.element.bound.x * ratio) + leftDistance) / screenHeight) * 100;
    var yMouse = ((((element.element.bound.y + element.element.bound.height) * ratio)) / screenHeight) * 100;

    var elementWidth = ((element.element.bound.width * ratio) / screenHeight) * 100;
    var elementHeight = ((element.element.bound.height * ratio) / screenHeight) * 100;

    x = x < 0 ? 0 : x;
    y = y < 0 ? 0 : y;
    xMouse = xMouse < 0 ? 0 : xMouse;
    yMouse = yMouse < 0 ? 0 : yMouse;

    
    x = x > 100 ? 100 : x;
    y = y > 100 ? 100 : y;
    xMouse = xMouse > 80 ? 80 : xMouse;
    yMouse = yMouse > 80 ? 80 : yMouse;

    return {x: x-1, y:y-1, xMouse: xMouse, yMouse:yMouse, width: elementWidth, height: elementHeight};
}

export function createBox(id, x,y, width, height, duration) { 
    var box = $("#box" + id);
    box.css("width", width + "vh");
    box.css("height", height + "vh");
    box.css("left", x + "vh");
    box.css("top", y + "vh");
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
            ease: Power0.easeNone
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
            ease: Power0.easeNone
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

export function clickAnimation(id, x,y) {
    var click = $("#click" + id);
    click.css("left", x + "vh");
    click.css("top", y + "vh");
    timelLineLite.fromTo(click, 0.2, 
        {
            immediateRender: false,
            autoRound: false,
            ease: Power0.easeNone,
            opacity: 0,
        },
        {
            opacity: 0.8,
            width: 25,
            height: 25
        }
    );
    timelLineLite.to(click, 0.2, 
        {
            opacity: 0
        }
    );
}

export function displayPopUp(frame, title, content, delay) {
    var d = delay ? delay : defaultDelay;
    timelLineLite.fromTo(frame, 0.5, {left: -$("#screenBackground").width()}, {
        left: 0,
        opacity: 0.9,
        display: "flex",
        delay: d
    });

    timelLineLite.fromTo(content, 0.3, {left: -$("#screenBackground").width()}, {
        left: ($("#screenBackground").width() / 100) * 1,
        opacity: 1,
        display: "flex"
    });

    timelLineLite.fromTo(title, 0.3, {left: -$("#screenBackground").width()}, {
        left: ($("#screenBackground").width() / 100) * 5,
        opacity: 1,
        display: "flex"
    });
}

export function hidePopUp(frame, title, content, delay) {
    var d = delay ? delay : defaultDelay;
    timelLineLite.to(title, 0.2, {
        left: -$("#screenBackground").width(),
        opacity: 1,
        display: "flex",
        delay: d
    });

    timelLineLite.to(content, 0.2, {
        left: -$("#screenBackground").width(),
        opacity: 1,
        display: "flex"
    });

    timelLineLite.to(frame, 0.2, {
        left: -$("#screenBackground").width(),
        opacity: 0,
        display: "flex"
    });
}