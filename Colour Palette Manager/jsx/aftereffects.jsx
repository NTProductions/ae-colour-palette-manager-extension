#include "json2.js"

function main() {
        app.beginUndoGroup("Colour Scheme Generation");
        
        var project = app.project;
        var comp = project.activeItem;
        
        if(comp.selectedLayers.length < 1 || comp.selectedLayers.length > 1) {
                alert("Please only select one layer");
                return false;
            }
        var layer = comp.selectedLayers[0];
        
        var colours = setupComp(comp, layer);
        return colours;
        app.endUndoGroup();
    }


function setupComp(comp, layer) {

var pointControl = layer.Effects.addProperty("ADBE Point Control");
var point = layer("Effects")("Point Control")("Point");

var redText = comp.layers.addText();
var redSourceText = redText.property("Source Text");
redSourceText.expression = 'targetLayer = thisComp.layer("' + layer.name + '"); samplePoint = targetLayer.effect("Point Control")("Point"); sampleRadius = [1,1]; sampledColor_8bpc = 255 * targetLayer.sampleImage(samplePoint, sampleRadius); R = Math.round(sampledColor_8bpc[0]); outputString = R';

var greenText = comp.layers.addText();
var greenSourceText = greenText.property("Source Text");
greenSourceText.expression = 'targetLayer = thisComp.layer("' + layer.name + '"); samplePoint = targetLayer.effect("Point Control")("Point"); sampleRadius = [1,1]; sampledColor_8bpc = 255 * targetLayer.sampleImage(samplePoint, sampleRadius); G = Math.round(sampledColor_8bpc[1]); outputString = G';

var blueText = comp.layers.addText();
var blueSourceText = blueText.property("Source Text");
blueSourceText.expression = 'targetLayer = thisComp.layer("' + layer.name + '"); samplePoint = targetLayer.effect("Point Control")("Point"); sampleRadius = [1,1]; sampledColor_8bpc = 255 * targetLayer.sampleImage(samplePoint, sampleRadius); B = Math.round(sampledColor_8bpc[2]); outputString = B';

var colours = analysePixels(comp, layer, point, pointControl, redText, greenText, blueText, redSourceText, greenSourceText, blueSourceText);
return colours;
}

function analysePixels(comp, layer, point, pointControl, redText, greenText, blueText, redSourceText, greenSourceText, blueSourceText){
        var width, height, pixels;
        var rValues = [];
        var gValues = [];
        var bValues = [];
    width = comp.width;
    height = comp.height;
    pixels = width * height;

for(var i = 1; i <= width; i += 50){
           
        for(var e = 1; e <= height; e += 50){
            point.setValue([i, e]);
            rValues.push(parseInt(redSourceText.value));
            gValues.push(parseInt(greenSourceText.value));
            bValues.push(parseInt(blueSourceText.value));
            }   
    }
    cleanup(redText, greenText, blueText, pointControl);
    var colours = calculateColours(rValues, gValues, bValues, comp);
    return colours;
}


function cleanup(redText, greenText, blueText, pointControl) {

redText.remove();
greenText.remove();
blueText.remove();
pointControl.remove();

}

function calculateColours(rValues, gValues, bValues, comp) {
var colourOne = [];
var colourTwo = [];
var colourThree = [];
var colourFour = [];
var colourFive = [];
var lows = [];
var mids = [];
var highs = [];
 
var totalColourValue;
var totalColourValueTwo;
var mf = 1; // maxiumum frequency
var m = 0; // counter
var items = []; // array for most common elements
 

        for(var j = 0; j <= rValues.length; j++){
                    items.push([rValues[j], gValues[j], bValues[j]]);
    }

for(var q = 0; q < items.length; q++){
        totalColourValue = items[q][0] + items[q][1] + items[q][2];
        if(totalColourValue <= 255){
                lows.push(items[q]);
            }
        if(totalColourValue > 255 && totalColourValue <= 510){
                mids.push(items[q]);
            }
        if(totalColourValue > 510){
                highs.push(items[q]);
            }
    }

if(lows.length < 1 && mids.length > 0){
    colourOne.push(mids[0]);
    colourTwo.push(mids[Math.round(mids.length / 2)]);
    }
if(lows.length < 1 && mids.length < 1){
    colourOne.push(highs[0]);
    colourTwo.push(highs[Math.round(highs.length / 2)]);
    }
if(lows.length > 0){
    colourOne.push(lows[0]);
    colourTwo.push(lows[Math.round(lows.length / 2)]);
    }

if(mids.length < 1 && lows.length > 0){
    colourThree.push(lows[Math.round(lows.length / 2)]);
    }
if(mids.length < 1 && lows.length < 1){
    colourThree.push(highs[Math.round(highs.length / 2)]);
    }
if(mids.length > 0){
    colourThree.push(mids[Math.round(mids.length / 2)]);
    }

if(highs.length < 1 && mids.length > 0){
    colourFour.push(mids[0]);
    colourFive.push(mids[Math.round(mids.length / 2)]);
    }
if(highs.length < 1 && mids.length < 1){
    colourFour.push(lows[0]);
    colourFive.push(lows[Math.round(lows.length / 2)]);
    }
if(highs.length > 0){
    colourFour.push(highs[0]);
    colourFive.push(highs[Math.round(highs.length / 2)]);
    }

//generatePalette(comp, colourOne, colourTwo, colourThree, colourFour, colourFive);

return JSON.stringify([[colourOne], [colourTwo], [colourThree], [colourFour], [colourFive]]);

}

function convertColour(colourString) {
    var parsedColour = colourString.substring(4, colourString.length - 1);
    parsedColour = parsedColour.split(", ");
    
    return parsedColour;
    }


function generatePalette(colourOne, colourTwo, colourThree, colourFour, colourFive) {
    colourOne = convertColour(colourOne);
    colourTwo =convertColour(colourTwo);
    colourThree = convertColour(colourThree);
    colourFour = convertColour(colourFour);
    colourFive = convertColour(colourFive);
var comp = app.project.activeItem;
var solidOne = comp.layers.addSolid([colourOne[0] / 255, colourOne[1] / 255, colourOne[2] / 255], "Colour One", comp.width, comp.height, 1, comp.duration);
var solidTwo = comp.layers.addSolid([colourTwo[0] / 255, colourTwo[1] / 255, colourTwo[2] / 255], "Colour Two", comp.width, comp.height, 1, comp.duration);
var solidThree = comp.layers.addSolid([colourThree[0] / 255, colourThree[1] / 255, colourThree[2] / 255], "Colour Three", comp.width, comp.height, 1, comp.duration);
var solidFour = comp.layers.addSolid([colourFour[0] / 255, colourFour[1] / 255, colourFour[2] / 255], "Colour Four", comp.width, comp.height, 1, comp.duration);
var solidFive = comp.layers.addSolid([colourFive[0] / 255, colourFive[1] / 255, colourFive[2] / 255], "Colour Five", comp.width, comp.height, 1, comp.duration);

solidOne.property("Scale").setValue([10, 10]);
solidTwo.property("Scale").setValue([10, 10]);
solidThree.property("Scale").setValue([10, 10]);
solidFour.property("Scale").setValue([10, 10]);
solidFive.property("Scale").setValue([10, 10]);

var baseScale = comp.width / 2;
var baseY = comp.height / 2;

solidOne.property("Position").setValue([baseScale, baseY * 1.85673]);
solidTwo.property("Position").setValue([baseScale * 1.2, baseY * 1.85673]);
solidThree.property("Position").setValue([baseScale * 1.4, baseY * 1.85673]);
solidFour.property("Position").setValue([baseScale * 1.6, baseY * 1.85673]);
solidFive.property("Position").setValue([baseScale * 1.8, baseY * 1.85673]);

comp.layers.precompose([1, 2, 3, 4, 5], "Colour Scheme");
}

