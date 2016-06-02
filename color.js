var bot = process.DiscordBot;

function colorCheck(m, cI) {
  switch(m[0]) {
    case 'convert':
      m.shift();
      convertColor(m, cI);
      break;
    default:
      //do nothing
  }
}
function convertColor(msg, cID) {
  var convF = msg[0].toUpperCase();
  var rgb;
  switch(convF) {
    case 'CMYK':
      msg.shift();
      rgb = CMYKtoRGB(msg, cID);
      RGBtoHEX(rgb, cID);
      RGBtoHSL(rgb, cID);
      RGBtoHSV(rgb, cID);
      RGBtoINT(rgb, cID);
      break;
    case 'HEX':
      msg.shift();
      rgb = HEXtoRGB(msg, cID);
      RGBtoCMYK(rgb, cID);
      RGBtoHSL(rgb, cID);
      RGBtoHSV(rgb, cID);
      RGBtoINT(rgb, cID);
      break;
    case 'HSL':
      msg.shift();
      rgb = HSLtoRGB(msg, cID);
      RGBtoCMYK(rgb, cID);
      RGBtoHEX(rgb, cID);
      RGBtoHSV(rgb, cID);
      RGBtoINT(rgb, cID);
      break;
    case 'HSV':
      msg.shift();
      rgb = HSVtoRGB(msg, cID);
      RGBtoCMYK(rgb, cID);
      RGBtoHEX(rgb, cID);
      RGBtoHSL(rgb, cID);
      RGBtoINT(rgb, cID);
      break;
    case 'INT':
      msg.shift();
      rgb = INTtoRGB(msg, cID);
      RGBtoCMYK(rgb, cID);
      RGBtoHEX(rgb, cID);
      RGBtoHSL(rgb, cID);
      RGBtoHSV(rgb, cID);
      break;
    case 'RGB':
      msg.shift();
      RGBtoCMYK(msg, cID);
      RGBtoHEX(msg, cID);
      RGBtoHSL(msg, cID);
      RGBtoHSV(msg, cID);
      RGBtoINT(msg, cID);
      break;
  }
}
//RGB to any other color format
function RGBtoCMYK(color, chID){
  console.log(color);
  if(checkRGB(color)) {
    var rPrime = color[0]/255;
    var gPrime = color[1]/255;
    var bPrime = color[2]/255;
    var K = (1 - Math.max(rPrime, gPrime, bPrime));
    var kPrime = 1 - K;
    var C = Math.round(((1 - rPrime - K) / kPrime)*1000) /10;
    var M = Math.round(((1 - gPrime - K) / kPrime)*1000) /10;
    var Y = Math.round(((1 - bPrime - K) / kPrime)*1000) /10;
    K = Math.round(K * 1000) / 10;
    bot.sendMessages(chID, ["`CMYK: " + C + "%, " + M + "%, " + Y + "%, " + K +"%`"]);
  }
}
function RGBtoHEX(color, chID){
  if(checkRGB(color)) {
    var r = toHex(color[0]);
    var g = toHex(color[1]);
    var b = toHex(color[2]);
    bot.sendMessages(chID, ["`HEX: #" + r + g + b + "`"]);
  }
}
function RGBtoHSL(color, chID){
  if(checkRGB(color)) {
    var rPrime = color[0]/255;
    var gPrime = color[1]/255;
    var bPrime = color[2]/255;
    var cMax = Math.max(rPrime, gPrime, bPrime);
    var cMin = Math.min(rPrime, gPrime, bPrime);
    var delta = cMax - cMin;
    var hue = 0;
    var sat = 0;
    var light = (cMax + cMin) / 2;
    if(delta == 0) {
      hue = 0;
    }
    else if(cMax == rPrime) {
      hue = 60 * (((gPrime - bPrime) / delta) % 6);
    }
    else if(cMax == gPrime) {
      hue = 60 * (((bPrime - rPrime) / delta) + 2);
    }
    else if(cMax == bPrime) {
      hue = 60 * (((rPrime - gPrime) / delta) + 4);
    }

    if(delta == 0) {
      sat = 0;
    }
    else if(delta != 0) {
      sat = (delta/(1-Math.abs(2*light-1)));
    }
    hue = Math.round(hue);
    if(hue < 0 ) {
      hue += 360;
    }
    sat = Math.round(sat * 1000) / 10;
    light = Math.round(light * 1000) / 10;
    bot.sendMessages(chID, ["`HSL: " + hue + "°, " + sat + "%, " + light + "% `"]);
  }
}
function RGBtoHSV(color, chID){
  if(checkRGB(color)) {
    var rPrime = color[0]/255;
    var gPrime = color[1]/255;
    var bPrime = color[2]/255;
    var cMax = Math.max(rPrime, gPrime, bPrime);
    var cMin = Math.min(rPrime, gPrime, bPrime);
    var delta = cMax - cMin;
    var hue = 0;
    var sat = 0;
    var light = cMax;
    if(delta == 0) {
      hue = 0;
    }
    else if(cMax == rPrime) {
      hue = 60 * (((gPrime - bPrime) / delta) % 6);
    }
    else if(cMax == gPrime) {
      hue = 60 * (((bPrime - rPrime) / delta) + 2);
    }
    else if(cMax == bPrime) {
      hue = 60 * (((rPrime - gPrime) / delta) + 4);
    }

    if(cMax == 0) {
      sat = 0;
    }
    else if(cMax != 0) {
      sat = (delta/cMax);
    }
    hue = Math.round(hue);
    if(hue < 0 ) {
      hue += 360;
    }
    sat = Math.round(sat * 1000) / 10;
    value = Math.round(light * 1000) / 10;
    bot.sendMessages(chID, ["`HSV: " + hue + "°, " + sat + "%, " + value + "% `"]);
  }
}
function RGBtoINT(color, chID){
  if(checkRGB(color)) {
    var intColor = 0;
    intColor += (256 * 256 * color[0]);
    intColor += 256 * color[1];
    intColor += 1*color[2];
    bot.sendMessages(chID, ["`INT: " + intColor + "`"]);
  }
}
// Other color formats to RGB
function CMYKtoRGB(color, chID){
  if(checkCMYK(color)) {
    var c = color[0] / 100;
    var m = color[1] / 100;
    var y = color[2] / 100;
    var k = color[3] / 100;
    var r = Math.round(255*(1-c)*(1-k));
    var g = Math.round(255*(1-m)*(1-k));
    var b = Math.round(255*(1-y)*(1-k));
    bot.sendMessages(chID, ["`RGB: " + r + " "+ g + " " + b +"`"]);
    var rgb = [r, g, b];
    return rgb;
  }
}
function HEXtoRGB(color, chID){
  if(checkHex(color)) {
    var hex = "0123456789ABCDEF";
    var r;
    var g;
    var b;
    var rgb;
    color = color[0].substring(1, color[0].length).toUpperCase();
    console.log("Length: " + color.length);
    if(color.length == 3) {
      color.split("");
      console.log(color);
      r = (hex.indexOf(color[0]) * 16 + hex.indexOf(color[0]));
      g = (hex.indexOf(color[1]) * 16 + hex.indexOf(color[1]));
      b = (hex.indexOf(color[2]) * 16 + hex.indexOf(color[2]));
      rgb =[r,g,b];
      bot.sendMessages(chID, ["`RGB: " + r + " "+ g + " " + b +"`"]);
      return rgb;
    }
    else if(color.length == 6) {
      color.split("");
      console.log(color);
      r = (hex.indexOf(color[0]) * 16 + hex.indexOf(color[1]));
      g = (hex.indexOf(color[2]) * 16 + hex.indexOf(color[3]));
      b = (hex.indexOf(color[4]) * 16 + hex.indexOf(color[5]));
      rgb =[r,g,b];
      bot.sendMessages(chID, ["`RGB: " + r + " "+ g + " " + b +"`"]);
      return rgb;
    }
  }
}
function HSLtoRGB(color, chID){
  if(checkHSL(color)) {
    var h = color[0];
    var s = color[1] / 100;
    var l = color[2] / 100;
    var rgb = [0, 0, 0];
    var rgbPrime = [0,0,0];
    var cPrime = (1-Math.abs(2*l - 1)) * s;
    var x = (cPrime * (1 - Math.abs((h / 60) %2 - 1)));
    var m = l - (cPrime / 2);
    if(h >= 0 && h < 60) {
      rgbPrime = [cPrime, x, 0];
    }
    else if(h >= 60 && h < 120) {
      rgbPrime = [x, cPrime, 0];
    }
    else if(h >= 120 && h < 180) {
      rgbPrime = [0, cPrime, x];
    }
    else if(h >= 180 && h < 240) {
      rgbPrime = [0, x, cPrime];
    }
    else if(h >= 240 && h < 300) {
      rgbPrime = [x, 0, cPrime];
    }
    else if(h >= 300 && h < 360) {
      rgbPrime = [cPrime, 0, x];
    }
    rgb = [Math.round((rgbPrime[0]+m)*255),
    Math.round((rgbPrime[1]+m)*255),
    Math.round((rgbPrime[2]+m)*255)];
    bot.sendMessages(chID, ["`RGB: " + rgb[0] + " " + rgb[1] + " " + rgb[2] + "`"]);
    return rgb;
  }
}
function HSVtoRGB(color, chID){
  if(checkHSV(color)) {
    var hue = color[0];
    var sat = color[1] / 100;
    var val = color[2] / 100;
    var rgb = [0, 0, 0];
    var rgbPrime = [0,0,0];
    var cPrime = val * sat;
    var xPrime = (hue / 60) % 2;
    var xPrime2 = (1 - Math.abs(xPrime - 1));
    var x = (cPrime * xPrime2);
    var m = val - cPrime;
    if(hue >= 0 && hue < 60) {
      rgbPrime = [cPrime, x, 0];
    }
    else if(hue >= 60 && hue < 120) {
      rgbPrime = [x, cPrime, 0];
    }
    else if(hue >= 120 && hue < 180) {
      rgbPrime = [0, cPrime, x];
    }
    else if(hue >= 180 && hue < 240) {
      rgbPrime = [0, x, cPrime];
    }
    else if(h >= 240 && h < 300) {
      rgbPrime = [x, 0, cPrime];
    }
    else if(h >= 300 && h < 360) {
      rgbPrime = [cPrime, 0, x];
    }
    rgb = [Math.round((rgbPrime[0]+m)*255),
    Math.round((rgbPrime[1]+m)*255),
    Math.round((rgbPrime[2]+m)*255)];
    bot.sendMessages(chID, ["`RGB: " + rgb[0] + " " + rgb[1] + " " + rgb[2] + "`"]);
    return rgb;
  }
}
function INTtoRGB(color, chID){
  if(color >= 0 && color <= 16777215) {
    var rgb =[0, 0, 0];
    var temp = color * 1;

    rgb[2] = temp % 256;
    temp = Math.floor(temp / 256);
    rgb[1] = temp % 256;
    temp = Math.floor(temp / 256);
    rgb[0] = temp % 256;

    bot.sendMessages(chID, ["`RGB: " + rgb[0] + " " + rgb[1] + " " + rgb[2] + "`"]);
    return rgb;
  }
}

function checkRGB(col) {
  var errorVal = 0;
    if(!isNaN(col[0]) && !isNaN(col[1]) && !isNaN(col[2])) {
      for(i = 0; i < col.length; ++i) {
        if(col[i] < 0 || col[i] > 255) {
        errorVal += 1;
        }
      }
    }
    else {
      errorVal += 1;
    }
    if(errorVal > 0) {
      return false;
    }
    else {
      return true;
    }
}
function checkCMYK(col) {
  var errorVal = 0;
  if(!isNaN(col[0]) && !isNaN(col[1]) && !isNaN(col[2]) && !isNaN(col[3])) {
    for(i = 0; i < col.length; ++i) {
      if(col[i] < 0 || col[i] > 100) {
      errorVal += 1;
      }
    }
  }
  else {
    errorVal += 1;
  }
  if(errorVal > 0) {
    return false;
  }
  else {
    return true;
  }
}
function checkHex(col) {
  var regExp = /^#([0-9A-F]{3}|[0-9A-F]{6})/i;
  console.log("In regex: " + regExp.test(col));
  if(regExp.test(col)){
    return true;
  }
  else {
    return false;
  }
}
function checkHSL(col){
  var h = col[0];
  var s = col[1];
  var l = col[2];
  var errorVal = 0;
  if(!isNaN(h) && !isNaN(s) && !isNaN(l)) {
    if(h > 360 || h < 0) {
      errorVal += 1;
    }
    if(s < 0 || s > 100) {
      errorVal += 1;
    }
    if(l < 0 || l > 100) {
      errorVal += 1;
    }
  }
  else {
    errorVal += 1;
  }
  if(errorVal > 0) {
    return false;
  }
  else {
    return true;
  }
  if(errorVal > 0) {
    return false;
  }
  else {
    return true;
  }
}
function checkHSV(col){
  var h = col[0];
  var s = col[1];
  var v = col[2];
  var errorVal = 0;
  if(!isNaN(h) && !isNaN(s) && !isNaN(v)) {
    if(h > 360 || h < 0) {
      errorVal += 1;
    }
    if(s < 0 || s > 100) {
      errorVal += 1;
    }
    if(v < 0 || v > 100) {
      errorVal += 1;
    }
  }
  else {
    errorVal += 1;
  }
  if(errorVal > 0) {
    return false;
  }
  else {
    return true;
  }
  if(errorVal > 0) {
    return false;
  }
  else {
    return true;
  }
}
function checkINT(col){}
function toHex(val) {
  var hex = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
  var quot = Math.floor(val / 16);
  var rem = val % 16;
  var result = hex[quot] + hex[rem];
  return result;
}

var colorFunctions = {
	colorCheck : colorCheck
};
module.exports = colorFunctions;