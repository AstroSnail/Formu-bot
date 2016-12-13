var bot = process.DiscordBot;

function colorCheck(m, cI) {
	switch (m[0]) {
		case 'convert':
			m.shift();
			convertColor(m, cI);
			break;
		case 'add':
			m.shift();
			addColor(m, cI);
			break;
		case 'sub':
			m.shift();
			subColor(m, cI);
			break;
		case 'gradient':
			m.shift();
			gradientColors(m, cI);
			break;
		default:
			//do nothing
	}
}

function convertColor(msg, cID) {
	var convF = msg[0].toUpperCase();
	var rgb;
	switch (convF) {
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

function addColor(msg, cID) {
	var color1 = [0, 0, 0];
	var color2 = [0, 0, 0];
	var resultColor = [0, 0, 0];
	if (msg.length == 6 && checkRGB(color1) && checkRGB(color2)) {
		color1[0] = Number(msg[0]);
		color1[1] = Number(msg[1]);
		color1[2] = Number(msg[2]);
		color2[0] = Number(msg[3]);
		color2[1] = Number(msg[4]);
		color2[2] = Number(msg[5]);

		for (i = 0; i <= 2; i++) {
			resultColor[i] = Math.round((color1[i] + color2[i]) / 2);
		}
		console.log(color1);
		console.log(color2);
		console.log(resultColor);
		bot.sendMessages(cID, ["`RGB: " + resultColor[0] + " " + resultColor[1] + " " + resultColor[2] + "`"]);
		RGBtoCMYK(resultColor, cID);
		RGBtoHEX(resultColor, cID);
		RGBtoHSL(resultColor, cID);
		RGBtoHSV(resultColor, cID);
		RGBtoINT(resultColor, cID);
	}
}

function subColor(msg, cID) {
	var startCol = [0, 0, 0];
	var subCol = a[0, 0, 0];
	var resultColor = [0, 0, 0];
	if (msg.length == 6 && checkRGB(startCol) && checkRGB(subCol)) {
		startCol[0] = Number(msg[0]);
		startCol[1] = Number(msg[1]);
		startCol[2] = Number(msg[2]);
		subCol[0] = Number(msg[3]);
		subCol[1] = Number(msg[4]);
		subCol[2] = Number(msg[5]);

		for (i = 0; i <= 2; i++) {
			resultColor[i] = Math.round(startCol[i] * 2 - subCol[i]);
			if (resultColor[i] < 0) {
				resultColor[i] = 0;
			} else if (resultColor[i] > 255) {
				resultColor[i] = 255;
			}
		}
		console.log(startCol);
		console.log(subCol);
		console.log(resultColor);
		bot.sendMessages(cID, ["`RGB: " + resultColor[0] + " " + resultColor[1] + " " + resultColor[2] + "`"]);
		RGBtoCMYK(resultColor, cID);
		RGBtoHEX(resultColor, cID);
		RGBtoHSL(resultColor, cID);
		RGBtoHSV(resultColor, cID);
		RGBtoINT(resultColor, cID);
	}
}

function gradientColors(msg, cID) {
	console.log(msg);
	var startCol = [0, 0, 0];
	var endCol = [0, 0, 0];
	var maxMid = 14;
	var minMid = 1;
	var midpts = Number(msg[msg.length - 1]);
	if(midpts >maxMid) {
		midpts = maxMid;
	} else if (midpts < minMid) {
		midpts = minMid;
	}
	var resultText = "";
	var rInterval, gInterval, bInterval = 0;

	// If in RGB mode, length will be 7, else HEX mode will be 3
	if (msg.length == 7 && checkRGB(startCol) && checkRGB(endCol)) {
		startCol[0] = Number(msg[0]);
		startCol[1] = Number(msg[1]);
		startCol[2] = Number(msg[2]);
		endCol[0] = Number(msg[3]);
		endCol[1] = Number(msg[4]);
		endCol[2] = Number(msg[5]);

		rInterval = (endCol[0] - startCol[0])/(midpts + 1);
		gInterval = (endCol[1] - startCol[1])/(midpts + 1);
		bInterval = (endCol[2] - startCol[2])/(midpts + 1);

		// Add start color to resultText
		resultText += ("```1) " + startCol[0] +" " + startCol[1] + " " + startCol[2] +"\n");
		// Add each interval to resultText
		for(var i = 1; i <= midpts; i++) {
			var tempR = Math.round(i * rInterval) + startCol[0];
			var tempG = Math.round(i * gInterval) + startCol[1];
			var tempB = Math.round(i * bInterval) + startCol[2];

			resultText += ((i+1) + ") " + tempR + " " + tempG + " " + tempB+"\n");
		}
		// Add ending color to resultText
		resultText += ((midpts+2) + ") " + endCol[0] + " " + endCol[1] + " " + endCol[2] +"```");

		// Send all of resultText to the user
		bot.sendMessages(cID, [resultText]);
	}
	else if(msg.length == 3) {
		tstartCol = msg[0];
		tendCol = msg[1];
		//Correct hex value for start color
		if(tstartCol.length == 3) {
			console.log("tstartcol 3");
			startCol[0] = tstartCol.substr(0,1).toUpperCase();
			startCol[1] = tstartCol.substr(1,1).toUpperCase();
			startCol[2] = tstartCol.substr(2,1).toUpperCase();

			// startCol[0] += startCol[0];
			// startCol[1] += startCol[1];
			// startCol[2] += startCol[2];
			console.log(startCol[0]);
			console.log(startCol[1]);
			console.log(startCol[2]);
		}
		else if(tstartCol.length == 6) {
			console.log("tstartcol 6");
			//012345
			startCol[0] = tstartCol.substr(0,2).toUpperCase();
			startCol[1] = tstartCol.substr(2,2).toUpperCase();
			startCol[2] = tstartCol.substr(4,2).toUpperCase();
			console.log(startCol[0]);
			console.log(startCol[1]);
			console.log(startCol[2]);
		}
		// Correct hex value for end color
		if(tendCol.length == 3) {
			console.log("tendcol 3");
				endCol[0] = tendCol.substr(0,1).toUpperCase();
				endCol[1] = tendCol.substr(1,1).toUpperCase();
				endCol[2] = tendCol.substr(2,1).toUpperCase();

				endCol[0] += endCol[0];
				endCol[1] += endCol[1];
				endCol[2] += endCol[2];
				console.log(endCol[0]);
				console.log(endCol[1]);
				console.log(endCol[2]);
		}
		else if(tendCol.length == 6) {
			console.log("tendcol 3");
			endCol[0] = tendCol.substr(0,2).toUpperCase();
			endCol[1] = tendCol.substr(2,2).toUpperCase();
			endCol[2] = tendCol.substr(4,2).toUpperCase();
			console.log(endCol[0]);
			console.log(endCol[1]);
			console.log(endCol[2]);
		}
		//parse values
		startCol[0] = parseInt(startCol[0], 16);
		startCol[1] = parseInt(startCol[1], 16);
		startCol[2] = parseInt(startCol[2], 16);
		endCol[0] = parseInt(endCol[0], 16);
		endCol[1] = parseInt(endCol[1], 16);
		endCol[2] = parseInt(endCol[2], 16);
		console.log("===========");
		console.log(startCol[0]);
		console.log(startCol[1]);
		console.log(startCol[2]);
		console.log(endCol[0]);
		console.log(endCol[1]);
		console.log(endCol[2]);
		// Calculate intervals between values
		rInterval = (endCol[0] - startCol[0])/(midpts + 1);
		console.log("rInterval: " + rInterval);
		gInterval = (endCol[1] - startCol[1])/(midpts + 1);
		console.log("gInterval: " + gInterval);
		bInterval = (endCol[2] - startCol[2])/(midpts + 1);
		console.log("bInterval: " + bInterval);

		// Add start color to resultText after a check
		var startR = startCol[0].toString(16);
		var startG = startCol[1].toString(16);
		var startB = startCol[2].toString(16);
		if(startR.length ==1) {
			startR += startR;
		}
		if(startG.length ==1) {
			startG += startG;
		}
		if(startB.length ==1) {
			startB += startB;
		}
		resultText += ("```1) #" + startR + startG + startB +"\n");
		// Add each interval to resultText
		for(var i = 1; i <= midpts; i++) {
			var tempR = Math.round(i * rInterval) + startCol[0];
			var tempG = Math.round(i * gInterval) + startCol[1];
			var tempB = Math.round(i * bInterval) + startCol[2];

			if(tempR.toString(16).length == 1) {
				tempR = tempR.toString(16) + tempR.toString(16);
			} else {
				tempR= tempR.toString(16);
			}
			if(tempG.toString(16).length == 1) {
				tempG = tempG.toString(16) + tempG.toString(16);
			} else {
				tempG = tempG.toString(16);
			}
			if(tempB.toString(16).length == 1) {
				tempB = tempB.toString(16) + tempB.toString(16);
			} else {
				tempB = tempB.toString(16);
			}

			resultText += ((i+1) + ") #" + tempR + tempG + tempB+"\n");
		}
		// Add ending color to resultText after some checks
		var endR = endCol[0].toString(16);
		var endG = endCol[1].toString(16);
		var endB = endCol[2].toString(16);
		if(endR.length ==1) {
			endR += endR;
		}
		if(endG.length ==1) {
			endG += endG;
		}
		if(endB.length ==1) {
			endB += endB;
		}

		resultText += ((midpts+2) + ") #" + endR + endG + endB +"```");

		// Send all of resultText to the user
		bot.sendMessages(cID, [resultText.toUpperCase()]);

	}
}

//RGB to any other color format
function RGBtoCMYK(color, chID) {
	console.log(color);
	if (checkRGB(color)) {
		var rPrime = color[0] / 255;
		var gPrime = color[1] / 255;
		var bPrime = color[2] / 255;
		var K = (1 - Math.max(rPrime, gPrime, bPrime));
		var kPrime = 1 - K;
		var C = Math.round(((1 - rPrime - K) / kPrime) * 1000) / 10;
		var M = Math.round(((1 - gPrime - K) / kPrime) * 1000) / 10;
		var Y = Math.round(((1 - bPrime - K) / kPrime) * 1000) / 10;
		K = Math.round(K * 1000) / 10;
		bot.sendMessages(chID, ["`CMYK: " + C + "%, " + M + "%, " + Y + "%, " + K + "%`"]);
	}
}

function RGBtoHEX(color, chID) {
	if (checkRGB(color)) {
		var r = toHex(color[0]);
		var g = toHex(color[1]);
		var b = toHex(color[2]);
		bot.sendMessages(chID, ["`HEX: #" + r + g + b + "`"]);
	}
}

function RGBtoHSL(color, chID) {
	if (checkRGB(color)) {
		var rPrime = color[0] / 255;
		var gPrime = color[1] / 255;
		var bPrime = color[2] / 255;
		var cMax = Math.max(rPrime, gPrime, bPrime);
		var cMin = Math.min(rPrime, gPrime, bPrime);
		var delta = cMax - cMin;
		var hue = 0;
		var sat = 0;
		var light = (cMax + cMin) / 2;
		if (delta == 0) {
			hue = 0;
		} else if (cMax == rPrime) {
			hue = 60 * (((gPrime - bPrime) / delta) % 6);
		} else if (cMax == gPrime) {
			hue = 60 * (((bPrime - rPrime) / delta) + 2);
		} else if (cMax == bPrime) {
			hue = 60 * (((rPrime - gPrime) / delta) + 4);
		}

		if (delta == 0) {
			sat = 0;
		} else if (delta != 0) {
			sat = (delta / (1 - Math.abs(2 * light - 1)));
		}
		hue = Math.round(hue);
		if (hue < 0) {
			hue += 360;
		}
		sat = Math.round(sat * 1000) / 10;
		light = Math.round(light * 1000) / 10;
		bot.sendMessages(chID, ["`HSL: " + hue + "°, " + sat + "%, " + light + "% `"]);
	}
}

function RGBtoHSV(color, chID) {
	if (checkRGB(color)) {
		var rPrime = color[0] / 255;
		var gPrime = color[1] / 255;
		var bPrime = color[2] / 255;
		var cMax = Math.max(rPrime, gPrime, bPrime);
		var cMin = Math.min(rPrime, gPrime, bPrime);
		var delta = cMax - cMin;
		var hue = 0;
		var sat = 0;
		var light = cMax;
		if (delta == 0) {
			hue = 0;
		} else if (cMax == rPrime) {
			hue = 60 * (((gPrime - bPrime) / delta) % 6);
		} else if (cMax == gPrime) {
			hue = 60 * (((bPrime - rPrime) / delta) + 2);
		} else if (cMax == bPrime) {
			hue = 60 * (((rPrime - gPrime) / delta) + 4);
		}

		if (cMax == 0) {
			sat = 0;
		} else if (cMax != 0) {
			sat = (delta / cMax);
		}
		hue = Math.round(hue);
		if (hue < 0) {
			hue += 360;
		}
		sat = Math.round(sat * 1000) / 10;
		value = Math.round(light * 1000) / 10;
		bot.sendMessages(chID, ["`HSV: " + hue + "°, " + sat + "%, " + value + "% `"]);
	}
}

function RGBtoINT(color, chID) {
	if (checkRGB(color)) {
		var intColor = 0;
		intColor += (256 * 256 * color[0]);
		intColor += 256 * color[1];
		intColor += 1 * color[2];
		bot.sendMessages(chID, ["`INT: " + intColor + "`"]);
	}
}
// Other color formats to RGB
function CMYKtoRGB(color, chID) {
	if (checkCMYK(color)) {
		var c = color[0] / 100;
		var m = color[1] / 100;
		var y = color[2] / 100;
		var k = color[3] / 100;
		var r = Math.round(255 * (1 - c) * (1 - k));
		var g = Math.round(255 * (1 - m) * (1 - k));
		var b = Math.round(255 * (1 - y) * (1 - k));
		bot.sendMessages(chID, ["`RGB: " + r + " " + g + " " + b + "`"]);
		var rgb = [r, g, b];
		return rgb;
	}
}

function HEXtoRGB(color, chID) {
	if (checkHex(color)) {
		var hex = "0123456789ABCDEF";
		var r;
		var g;
		var b;
		var rgb;
		color = color[0].substring(1, color[0].length).toUpperCase();
		console.log("Length: " + color.length);
		if (color.length == 3) {
			color.split("");
			console.log(color);
			r = (hex.indexOf(color[0]) * 16 + hex.indexOf(color[0]));
			g = (hex.indexOf(color[1]) * 16 + hex.indexOf(color[1]));
			b = (hex.indexOf(color[2]) * 16 + hex.indexOf(color[2]));
			rgb = [r, g, b];
			bot.sendMessages(chID, ["`RGB: " + r + " " + g + " " + b + "`"]);
			return rgb;
		} else if (color.length == 6) {
			color.split("");
			console.log(color);
			r = (hex.indexOf(color[0]) * 16 + hex.indexOf(color[1]));
			g = (hex.indexOf(color[2]) * 16 + hex.indexOf(color[3]));
			b = (hex.indexOf(color[4]) * 16 + hex.indexOf(color[5]));
			rgb = [r, g, b];
			bot.sendMessages(chID, ["`RGB: " + r + " " + g + " " + b + "`"]);
			return rgb;
		}
	}
}

function HSLtoRGB(color, chID) {
	if (checkHSL(color)) {
		var h = color[0];
		var s = color[1] / 100;
		var l = color[2] / 100;
		var rgb = [0, 0, 0];
		var rgbPrime = [0, 0, 0];
		var cPrime = (1 - Math.abs(2 * l - 1)) * s;
		var x = (cPrime * (1 - Math.abs((h / 60) % 2 - 1)));
		var m = l - (cPrime / 2);
		if (h >= 0 && h < 60) {
			rgbPrime = [cPrime, x, 0];
		} else if (h >= 60 && h < 120) {
			rgbPrime = [x, cPrime, 0];
		} else if (h >= 120 && h < 180) {
			rgbPrime = [0, cPrime, x];
		} else if (h >= 180 && h < 240) {
			rgbPrime = [0, x, cPrime];
		} else if (h >= 240 && h < 300) {
			rgbPrime = [x, 0, cPrime];
		} else if (h >= 300 && h < 360) {
			rgbPrime = [cPrime, 0, x];
		}
		rgb = [Math.round((rgbPrime[0] + m) * 255),
			Math.round((rgbPrime[1] + m) * 255),
			Math.round((rgbPrime[2] + m) * 255)
		];
		bot.sendMessages(chID, ["`RGB: " + rgb[0] + " " + rgb[1] + " " + rgb[2] + "`"]);
		return rgb;
	}
}

function HSVtoRGB(color, chID) {
	if (checkHSV(color)) {
		var hue = color[0];
		var sat = color[1] / 100;
		var val = color[2] / 100;
		var rgb = [0, 0, 0];
		var rgbPrime = [0, 0, 0];
		var cPrime = val * sat;
		var xPrime = (hue / 60) % 2;
		var xPrime2 = (1 - Math.abs(xPrime - 1));
		var x = (cPrime * xPrime2);
		var m = val - cPrime;
		if (hue >= 0 && hue < 60) {
			rgbPrime = [cPrime, x, 0];
		} else if (hue >= 60 && hue < 120) {
			rgbPrime = [x, cPrime, 0];
		} else if (hue >= 120 && hue < 180) {
			rgbPrime = [0, cPrime, x];
		} else if (hue >= 180 && hue < 240) {
			rgbPrime = [0, x, cPrime];
		} else if (h >= 240 && h < 300) {
			rgbPrime = [x, 0, cPrime];
		} else if (h >= 300 && h < 360) {
			rgbPrime = [cPrime, 0, x];
		}
		rgb = [Math.round((rgbPrime[0] + m) * 255),
			Math.round((rgbPrime[1] + m) * 255),
			Math.round((rgbPrime[2] + m) * 255)
		];
		bot.sendMessages(chID, ["`RGB: " + rgb[0] + " " + rgb[1] + " " + rgb[2] + "`"]);
		return rgb;
	}
}

function INTtoRGB(color, chID) {
	if (color >= 0 && color <= 16777215) {
		var rgb = [0, 0, 0];
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
// Testing values to make sure they fit withing the color mode
function checkRGB(col) {
	var errorVal = 0;
	if (!isNaN(col[0]) && !isNaN(col[1]) && !isNaN(col[2])) {
		for (i = 0; i < col.length; ++i) {
			if (col[i] < 0 || col[i] > 255) {
				errorVal += 1;
			}
		}
	} else {
		errorVal += 1;
	}
	if (errorVal > 0) {
		return false;
	} else {
		return true;
	}
}

function checkCMYK(col) {
	var errorVal = 0;
	if (!isNaN(col[0]) && !isNaN(col[1]) && !isNaN(col[2]) && !isNaN(col[3])) {
		for (i = 0; i < col.length; ++i) {
			if (col[i] < 0 || col[i] > 100) {
				errorVal += 1;
			}
		}
	} else {
		errorVal += 1;
	}
	if (errorVal > 0) {
		return false;
	} else {
		return true;
	}
}

function checkHex(col) {
	var regExp = /^#([0-9A-F]{3}|[0-9A-F]{6})/i;
	console.log("In regex: " + regExp.test(col));
	if (regExp.test(col)) {
		return true;
	} else {
		return false;
	}
}

function checkHSL(col) {
	var h = col[0];
	var s = col[1];
	var l = col[2];
	var errorVal = 0;
	if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
		if (h > 360 || h < 0) {
			errorVal += 1;
		}
		if (s < 0 || s > 100) {
			errorVal += 1;
		}
		if (l < 0 || l > 100) {
			errorVal += 1;
		}
	} else {
		errorVal += 1;
	}
	if (errorVal > 0) {
		return false;
	} else {
		return true;
	}
	if (errorVal > 0) {
		return false;
	} else {
		return true;
	}
}

function checkHSV(col) {
	var h = col[0];
	var s = col[1];
	var v = col[2];
	var errorVal = 0;
	if (!isNaN(h) && !isNaN(s) && !isNaN(v)) {
		if (h > 360 || h < 0) {
			errorVal += 1;
		}
		if (s < 0 || s > 100) {
			errorVal += 1;
		}
		if (v < 0 || v > 100) {
			errorVal += 1;
		}
	} else {
		errorVal += 1;
	}
	if (errorVal > 0) {
		return false;
	} else {
		return true;
	}
	if (errorVal > 0) {
		return false;
	} else {
		return true;
	}
}

function checkINT(col) {
	if (col >= 0 && col <= 16777215) {
		return true;
	} else {
		return false;
	}
}

function toHex(val) {
	var hex = "0123456789ABCDEF";
	var quot = Math.floor(val / 16);
	var rem = val % 16;
	var result = hex[quot] + hex[rem];
	return result;
}

var colorFunctions = {
	colorCheck: colorCheck
};
module.exports = colorFunctions;
