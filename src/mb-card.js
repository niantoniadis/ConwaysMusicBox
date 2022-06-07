const template = document.createElement("template");
template.innerHTML = `
<style>
div{
  height: 200px;
  width: 150px;
  border: 1px solid gray;
  padding: .5rem;
  background-color: #000;
  overflow: auto;
  font-size: .7rem;
  position: relative;
  float: left;
}

h2{
  font-size: 1.1rem;
  font-family: SfDistantGalaxy, sans-serif;
  letter-spacing: .67px;
  line-height: 1.2;
  margin-top: 0;
}

img{
  width: 100px;
}
button{
  border-radius: 1px;
  padding: 4px 10px;
  position: absolute;
  left: 25px;
  right:25px;
  bottom: 15px;
  opacity: 1;
}
button:hover{
  opacity: 0.2;
}
</style>
<div>
    <canvas width="150" height="150"></canvas>
    <button>Load</button>
</div>
`;

import * as storage from "./localStorage.js";
import * as canvas from "./canvas.js";


class MusicBoxCard extends HTMLElement{
    constructor(){
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.canvas = this.shadowRoot.querySelector("canvas");
      canvas.setupCanvas(this.canvas);
      this.btn = this.shadowRoot.querySelector("button");
    }

    saveFavorite(){
      for(let f of storage.getFavorites()){
        if(f == this.dataset.world){
          return;
        }
      }
      storage.addFavorite(this.dataset.world);
    }

    connectedCallback(){
      this.btn.onclick = () => {
        storage.setLifeworld(JSON.parse(this.dataset.world));
        location.href = `${location.href.slice(0, location.href.lastIndexOf('/'))}/app.html`;
      };
      this.btn.disabled = false;
      //for(let f of storage.getFavorites()){
      //  if(JSON.parse(f).title == this.dataset.title){
      //    this.btn.innerHTML = "✓";
      //    this.btn.disabled = true;
      //  }
      //}
      this.render();
    }

    disconnectedCallback(){

    }

    attributeChangedCallback(attributeName, oldVal, newVal){
      this.render();
    }

    static get observedAttributes(){
      return ["data-world"];
    }

    render(){
      canvas.drawWorldArray(JSON.parse(this.dataset.world));
    }
}

customElements.define('mb-card', MusicBoxCard);