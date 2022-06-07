import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';
import * as storage from './localStorage.js'
import * as firebase from './firebase.js'
import Lifeworld from './Lifeworld.js';



const fps = 8;
let lifeworld;
let playing = false;
let currCol = 0;
let autoStep;
let cleared = false;
let currentSoundURL;

const keys = [
  40,
  41,
  43,
  45,
  47,
  48,
  50,
  52,
  53,
  55,
  57,
  59,
  60,
  62,
  64,
  65
]

const DEFAULTS = Object.freeze({
  "media/DKalimba.wav" : 50,
  "media/sinewave.wav" : 50,
  "media/synthTone.wav" : 48
});

function init(){
  lifeworld = new Lifeworld(16,16,.2);
  if(!storage.getLifeworld() || !storage.getSound()){
    storage.clearLocalStorage();
  }
  else{
    lifeworld = new Lifeworld(16,16,.2,storage.getLifeworld())
  }
  currentSoundURL = storage.getSound() == "" ? "media/synthTone.wav" : storage.getSound();
  audio.setupWebAudio(currentSoundURL);
  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
  canvas.setupCanvas(canvasElement,audio.analyserNode);
  firebase.init();
  loop();
}

function setupUI(canvasElement){
  canvasElement.addEventListener('mousedown', function(e) {
    checkCellClicked(canvasElement, e)
  })

  const replayButton = document.querySelector("#replayButton");
	
  // add .onclick event to button
  replayButton.onclick = e => {
    currCol = 0;
    playing = true;
  };

  const stepButton = document.querySelector("#stepButton");

  stepButton.onclick = e => {
    lifeworld.step();
    playing = true;
    currCol = 0;
  }

  const resetButton = document.querySelector("#resetButton");

  resetButton.onclick = e => {
    lifeworld.reset();
  }

  const clearButton = document.querySelector("#clearButton");

  clearButton.onclick = e => {
    lifeworld.clear();
    cleared = true;
  }

  const saveOriginalButton = document.querySelector("#saveButton");

  saveOriginalButton.onclick = e => {
    if(cleared){
      lifeworld.worldStart = lifeworld.world;
    }
    storage.addFavorite(lifeworld.worldStart);
  }

  const saveCurrButton = document.querySelector("#saveCurrButton");

  saveCurrButton.onclick = e => {
    storage.addFavorite(lifeworld.world);
  }

  const uploadButton = document.querySelector("#uploadButton");

  uploadButton.onclick = e => {
    if(cleared){
      lifeworld.worldStart = lifeworld.world;
    }
    firebase.writeLifeworldData(lifeworld.worldStart);
  }

  const volumeSlider = document.querySelector("#volumeSlider");
  const volumeLabel = document.querySelector("#volumeLabel");

  let vol = storage.getVolume();
  audio.setVolume(vol);
  volumeLabel.innerHTML = Math.round((vol/2 * 15));
  volumeSlider.value = vol;

  volumeSlider.oninput = e => {
    audio.setVolume(e.target.value);
    volumeLabel.innerHTML = Math.round((e.target.value/2 * 15));
    storage.setVolume(e.target.value);
  }

  volumeSlider.dispatchEvent(new Event("input"));

  const soundSelect = document.querySelector("#soundSelect");

  soundSelect.onchange = e => {
      audio.setupWebAudio(e.target.value);
      currentSoundURL = e.target.value;
      storage.setSound(currentSoundURL);
  }

  soundSelect.value = currentSoundURL;

  

  const autoCb = document.querySelector("#autoCB");

  autoStep = storage.getAutoplay();
  autoCb.checked = autoStep;

  autoCb.onchange = e => {
    autoStep = e.target.checked;
    storage.setAutoplay(autoStep);
  }

  //let gradCheck = document.querySelector("#gradientCB");
  //gradCheck.checked = true;
  //gradCheck.onchange = e => {
  //  drawParams.showGradient = e.target.checked;
  //}
//
  //let barCheck = document.querySelector("#barsCB")
  //barCheck.checked = true;
  //barCheck.onchange = e => {
  //  drawParams.showBars = e.target.checked;
  //}
//
  //let circleCheck = document.querySelector("#circlesCB")
  //circleCheck.checked = true;
  //circleCheck.onchange = e => {
  //  drawParams.showCircles = e.target.checked;
  //}
//
  //let noiseCheck = document.querySelector("#noiseCB")
  //noiseCheck.checked = false;
  //noiseCheck.onchange = e => {
  //  drawParams.showNoise = e.target.checked;
  //}
//
  //let invertCheck = document.querySelector("#invertCB")
  //invertCheck.checked = false;
  //invertCheck.onchange = e => {
  //  drawParams.invert = e.target.checked;
  //}
//
  //let embossCheck = document.querySelector("#embossCB")
  //embossCheck.checked = false;
  //embossCheck.onchange = e => {
  //  drawParams.emboss = e.target.checked;
  //}
	
} // end setupUI

function loop(){
	setTimeout(loop,1000/fps);
  if(playing){
    if(currCol < lifeworld.numCols){
      canvas.drawColumn(lifeworld, currCol);
      for(let row = 0; row < lifeworld.numRows; row++){
        if(lifeworld.world[currCol][row] == 1){
          audio.playSoundAt(DEFAULTS[currentSoundURL],keys[row]);
        }
      }
      currCol++;
    }
    else{
      playing = false;
      currCol = 0;
      canvas.drawWorld(lifeworld);
    }

    if(cleared){
      cleared = false;
      lifeworld.worldStart = lifeworld.world;
    }
  }
  else if(autoStep){ 
    lifeworld.step();
    playing = true;
    currCol = 0;
    if(!lifeworld.isChanging()){
      lifeworld.reset();
    }
  }
  else{
	  canvas.drawWorld(lifeworld);
  }
  storage.setLifeworld(lifeworld.world);
}

function checkCellClicked(canvas, e) {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  if(x%lifeworld.cellWidth > lifeworld.cellWidth * 0.75 || y%lifeworld.cellWidth > lifeworld.cellWidth * 0.75){
    return;
  }
  lifeworld.world[Math.floor(x / lifeworld.cellWidth)][Math.floor(y / lifeworld.cellWidth)] = 
    lifeworld.world[Math.floor(x / lifeworld.cellWidth)][Math.floor(y / lifeworld.cellWidth)] == 0 ? 1 : 0;
}

export {init};