(function () {
 'use strict';

var paletteCounter = 0;
 var csInterface = new CSInterface();
 var colourValues = undefined;

 document.getElementById('logoimage').addEventListener('click', function() {
 	csInterface.openURLInDefaultBrowser("https://videohive.net/user/penguino138/portfolio");
 //csInterface.evalScript('openVideoHive()');

 });

 document.getElementById('addButton').addEventListener('click', function() {
 	paletteCounter++;
 	var addInterface = new CSInterface();
	colourValues = undefined;
	addInterface.evalScript('main()', function(res) {
		colourValues = JSON.parse(res);
		var thisSplit = [];
		var allHex = [];
		var div;
		var lineBreak;

if(colourValues != false) {
			var palette = document.createElement("div");
			palette.style.width = "480px";
			palette.style.height = "80px";
			//palette.style.backgroundColor = "#000000";
			palette.setAttribute("id", "palette" + paletteCounter);
			palette.setAttribute("class", "paletteHolder");
			
			document.getElementById('palettes').appendChild(palette);
				
		for(var i = 0; i < colourValues.length; i++) {
			thisSplit = colourValues[i].toString().split(",");
			allHex.push(rgbToHex(parseInt(thisSplit[0]), parseInt(thisSplit[1]), parseInt(thisSplit[2])));

			div = document.createElement("div");
			div.style.width = "80px";
			div.style.height = "80px";
			div.style.backgroundColor = allHex[i];
			div.setAttribute("class", "colourPanel");

			document.getElementById('palette' + paletteCounter).appendChild(div);

		}
		var deleteButton = document.createElement("button");
		deleteButton.style.width = "60px";
		deleteButton.style.height = "60px";
		deleteButton.style.marginLeft = "10px";
		deleteButton.style.marginRight = "10px";
		deleteButton.style.marginTop = "10px";
		deleteButton.style.marginBottom = "10px";
		deleteButton.innerHTML = "Comp";
		deleteButton.setAttribute("class", "topcoat-button");
		deleteButton.setAttribute("id", paletteCounter);
		deleteButton.setAttribute("onclick", "addToComp(this)");

		document.getElementById('palette' + paletteCounter).appendChild(deleteButton);


		lineBreak = document.createElement("br");
		document.getElementById('palettes').appendChild(lineBreak);
	}
	});

});


 }());

function addToComp(thisDelButton) {
	var thisPalette = thisDelButton.parentElement;
	var theseColours = thisPalette.getElementsByClassName("colourPanel");
	
    var newInterface = new CSInterface();     
    newInterface.evalScript('generatePalette("' + theseColours[0].style.backgroundColor + '", "' + theseColours[1].style.backgroundColor + '", "' + theseColours[2].style.backgroundColor + '", "' + theseColours[3].style.backgroundColor + '", "' + theseColours[4].style.backgroundColor + '")'); 
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

