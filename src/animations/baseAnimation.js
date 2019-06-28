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
    var screenHeight = $("#screenBackground").height()
    var screenWidth = $("#screenBackground").width() - 10; // 10 = panelSeparator
    var ratio = screenHeight / element.channelBound.height;
    var imgClientWidth = element.channelBound.width * ratio;
    var leftDistance = (screenWidth - imgClientWidth) / 2;

    var x = (((element.element.bound.x * ratio) + leftDistance) / screenWidth) * 100;
    var y = ((element.element.bound.y * ratio) / screenHeight) * 100;

    var xMouse = (((element.element.bound.x * ratio) + leftDistance) / screenWidth) * 100;
    var yMouse = ((((element.element.bound.y + element.element.bound.height) * ratio)) / screenHeight) * 100;

    var elementWidth = ((element.element.bound.width * ratio) / screenWidth) * 100;
    var elementHeight = ((element.element.bound.height * ratio) / screenHeight) * 100;

    return {x: x, y:y, xMouse: xMouse, yMouse:yMouse, width: elementWidth, height: elementHeight};
}

export function createBox(id, x,y, width, height, duration) { 
    var box = $("#box" + id);
    box.css("width", width + "%");
    box.css("height", height + "%");
    box.css("left", x + "%");
    box.css("top", y + "%");
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
    click.css("left", x + "%");
    click.css("top", y + "%");
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