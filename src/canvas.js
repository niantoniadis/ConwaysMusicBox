/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';



let ctx,canvasWidth,canvasHeight,gradient;



function setupCanvas(canvasElement){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0.15,color:"pink"},{percent:.5,color:"cyan"},{percent:1,color:"red"}]);
	// keep a reference to the analyser node;
	// this is the array where the analyser data will be stored
    drawBackground();
}

function drawBackground(){
	ctx.save();
	ctx.fillStyle = "#21454a";
	ctx.globalAlpha = 4/16;
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.restore();
}

function drawWorld(lifeworld){
    let cellWidth = canvasWidth / lifeworld.numCols;
    drawBackground();
    ctx.save();
    for(let col = 0; col < lifeworld.numCols; col++){
        for(let row = 0; row < lifeworld.numRows; row++){
            drawCell(col,row,cellWidth, lifeworld.world[col][row]);
        }
    }
    ctx.restore();
}

function drawWorldArray(world){
    let cellWidth = canvasWidth / 16;
    drawBackground();
    ctx.save();
    for(let col = 0; col < 16; col++){
        for(let row = 0; row < 16; row++){
            drawCell(col,row,cellWidth, world[col][row]);
        }
    }
    ctx.restore();
}

function drawColumn(lifeworld, col){
    drawWorld(lifeworld);
    ctx.save();
    for(let row = 0; row < lifeworld.numRows; row++){
        
        drawCellHighlight(col,row,lifeworld.cellWidth, lifeworld.world[col][row]);
    }
    ctx.restore();
}

function drawCell(col,row,dimensions,alive) {
	ctx.beginPath();
  ctx.rect(col*dimensions,row*dimensions, dimensions*0.75, dimensions*0.75);
  ctx.fillStyle = alive ? "#d89de0" : 'black';
  ctx.fill();
}



function drawCellHighlight(col,row,dimensions,alive) {
    ctx.beginPath();
  ctx.rect(col*dimensions + 0.125 * dimensions,row*dimensions + 0.125 * dimensions, dimensions*0.5, dimensions*0.5);
  ctx.fillStyle = alive ? "white" : 'black';
  ctx.fill();
}

export {drawWorld, drawWorldArray,drawColumn,setupCanvas};