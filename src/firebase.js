import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getDatabase, ref, get, push, child } from  "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8qN18C5s_nIrWNS4BZWfnCYITEQ0JLBY",
  authDomain: "conways-music-box.firebaseapp.com",
  projectId: "conways-music-box",
  storageBucket: "conways-music-box.appspot.com",
  messagingSenderId: "464378666645",
  appId: "1:464378666645:web:fa16b809794dd05285c59c"
};

const init = () =>{

// Initialize Firebase
const app = initializeApp(firebaseConfig);
}

const writeLifeworldData = (worldArr) => {
    const db = getDatabase();
    const worldsRef = ref(db, "worlds");
    const newWorldRef = push(worldsRef, worldArr);
  };

const displayCommunity = () =>{
    const dbRef = ref(getDatabase());
    get(child(dbRef, `worlds`)).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach(world => {
            const mbCard = document.createElement("mb-card");
            mbCard.dataset.world = JSON.stringify(world.val());
            document.querySelector("#community").appendChild(mbCard);
          });
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
};



export {init, writeLifeworldData, displayCommunity};