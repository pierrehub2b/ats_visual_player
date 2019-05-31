import codeURL from "./images/agilitest_logo.png"
var $ = require('jQuery');

const img = $('<img>');
img.attr('src', codeURL);
$("#logo").append(img);

const img2 = $('<img>');
img2.attr('src', codeURL);
$("#flashReport").append(img2);

