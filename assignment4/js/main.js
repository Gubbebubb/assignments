const houses = document.getElementById("houses");
const scareList = ["Bebisens första skräckhus", "Konstig stämning", "Indieskräckfilm", "Makare av mardrömmar", "Ren terror"]
let houseData = [];

const slider = document.getElementById("slider");
const sliderText = document.getElementById("slider-text")

const price = document.getElementById("price");

let curPrice = 9999999;

const ghosts = document.getElementById("ghosts");
let filteredData = "";

const wifi = document.getElementById("wifi");
let wifiReq = false;

async function fetchHouses() {
    try {
        const response = await fetch("houses.json")
        if (!response.ok) throw new Error("Kunde inte hämta husdata");
        houseData = await response.json();
        renderGhosts();
        renderHouses();
    } catch (error) {
        houses.innerHTML = `<p class="error">${error.message}</p>`;
        houses.classList.add("error");
    }
}

function renderHouses() {
    try {
        houses.innerHTML = "";
        houses.classList.remove("error");
        filteredData = houseData.filter(h => {
            const scariness = h.scareLevel >= slider.value;
            const ppn = h.pricePerNight <= curPrice;
            const ghostslist = selected == "all" || h.ghostTypes.includes(selected);
            const hw = !wifiReq || h.hasWifi;
            return scariness && ppn && ghostslist && hw;
        })

        if (filteredData.length == 0) {
            houses.innerHTML = `<p class="error">INGA SPÖKHUS MATCHADE DIN SÖKNING - KANSKE SÄNKA KRAVEN LITE? SPÖKENA VÄNTAR!</p>`
            houses.classList.add("error");
            return
        }
        for (let house of filteredData) {
            let card = document.createElement("div");
            card.innerHTML = `
            <img src="images/${house.image}" alt="${house.name}">
            <h3>${house.name}</h3>
            <p>${house.location}</p>
            <p>${house.pricePerNight} Kr</p>
            <p class="level${house.scareLevel}">${scareConverter(house.scareLevel)}</p>
            <a href="house.html?id=${house.id}">Läs mer och boka</a>
            `
            houses.append(card);
            card.classList.add("card");
        }
    } catch (error) {
        houses.innerHTML = `<p class="error">${error.message}</p>`;
        houses.classList.add("error");
    }
}

function scareConverter(level) {
    return scareList[level - 1];
}

slider.addEventListener("input", function () {
    sliderText.textContent = "Lägsta skräcknivå: " + scareConverter(slider.value);
    sliderText.style.color = `rgb(225, ${225 / slider.value}, ${224 / slider.value})`;
    sliderText.style.textShadow = `0.1em 0.1em 0.1rem rgb(112, ${112.5 / slider.value}, ${112 / slider.value})`;
    sliderText.style.letterSpacing = (slider.value / 40) + "rem";
    renderHouses();
})

price.addEventListener("input", function () {
    curPrice = price.value;
    if (curPrice === "") {
        curPrice = 9999999;
    }
    renderHouses();
})

ghosts.addEventListener("input", function () {
    selected = ghosts.value;
    renderHouses();
})

wifi.addEventListener("change", function () {
    if (wifiReq == true) {
        wifiReq = false;
    }
    else {
        wifiReq = true;
    }
    renderHouses();
    console.log(wifiReq);
})

let options = [];
let selected = "all";

function renderGhosts() {
    let ghostData = houseData.map(h => h.ghostTypes).flat();
    for (let ghost of ghostData) {
        if (!options.includes(ghost)) {
            options.push(ghost);
        }
    }
    for (let option of options) {
        let choice = document.createElement("option");
        choice.value = option;
        choice.textContent = option;
        ghosts.append(choice);
    }
}