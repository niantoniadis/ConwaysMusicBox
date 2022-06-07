import * as storage from "./localStorage.js";
import "./mb-card.js";

document.querySelector("#clear-button").onclick = () => {
    storage.clearFavorites();
    for(let f of document.querySelectorAll("mb-card")){
        f.remove();
    }
}

const showFavorite = lifeworld =>{
    const mbCard = document.createElement("mb-card");
    mbCard.dataset.world = lifeworld;
    document.querySelector("#favorites").appendChild(mbCard);
};

for(let f of storage.getFavorites()){
    showFavorite(JSON.stringify(f));
}
