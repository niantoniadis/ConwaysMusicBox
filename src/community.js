import * as firebase from "./firebase.js";
import "./mb-card.js";

firebase.init();


for(let f of document.querySelectorAll("mb-card")){
      f.remove();
  }

firebase.displayCommunity();