var $ = require('jQuery');
import { timelLineLite } from '../uploader';

export var pathToAssets = "./assets/icons/32/";
export var box = '<div class="box"><span id="left-side"></span><span id="top-side"></span><span id="right-side"></span><span id="bottom-side"></span></div>';
export var clickEffectElement = '<div class="circle"><div class="inner"></div></div>';
export var templateFrame = '<div class="overlay"><div class="popup"><img class="animationImg" /><h2></h2><div class="content"></div></div></div>';
export var mousePointer = "<div class='pointerAction'><img class='animationImg' src='"+pathToAssets+"mouse.png' /></div>";
export var keyboardPointer = "<div class='pointerAction'><img class='animationImg' src='"+pathToAssets+"keyboard.png' /></div>";
export var arrowUp = "<div class='pointerAction'><img class='animationImg' src='"+pathToAssets+"mouse_select_scroll_up.png' /></div>";
export var arrowDown = ""+pathToAssets+"mouse_select_scroll_down.png";

export var previousMousePosition = {x: 0, y: $("#screenBackground").height()};
export var borderSize = 3;

export function calculPositions(element) {
    //calcul position
    var ratio = $("#screenBackground").height() / element.channelBound.height;
    var clientWidth = element.channelBound.width*ratio;
    var origin = clientWidth - (clientWidth/2);
    var x = -origin + (element.element.bound.x*ratio) - 3;
    var y = element.element.bound.y*ratio - 3;
    var xMouse = x + (element.element.bound.width * ratio);
    var yMouse = y + (element.element.bound.height * ratio);
    return {x: x, y:y, xMouse: xMouse, yMouse:yMouse, ratio: ratio};
}

export function createBox(id, x,y, width, height, duration) { 
    var box = $("#box" + id);
    box.css("width", width);
    box.css("height", height);
    box.css("left", $("#screenBackground").width() / 2 + x);
    box.css("top", y);
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
            width: width
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
            height: height
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
            width: width
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
            height: height
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
    timelLineLite.fromTo(click, 0.2, 
        {
            x: x-4,
            y: y-6,
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