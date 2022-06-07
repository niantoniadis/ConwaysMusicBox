document.querySelector("#getStarted").onclick = () => {
    location.href = `${location.href.slice(0, location.href.lastIndexOf('/'))}/app.html`;
}