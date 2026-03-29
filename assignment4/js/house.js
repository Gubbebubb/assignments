const scareList = ["Bebisens första skräckhus", "Konstig stämning", "Indieskräckfilm", "Makare av mardrömmar", "Ren terror"]

const info = document.getElementById("info");
const bookContainer = document.getElementById("container");

import { Booking } from "./booking.js";

const breakfastCheck = document.getElementById("breakfast");
const wanderCheck = document.getElementById("wander");
const seanceCheck = document.getElementById("seance");
const dayCount = document.getElementById("days");

let bookClass;
let total = document.getElementById("total");


breakfastCheck.addEventListener("change", function () {
    if (houseData.length != 0 && !bookClass.extra.includes("breakfast")) {
        bookClass.extra.push("breakfast");
        total.textContent = "Totalt: " + bookClass.totalCalc() + " kr";
    }
    else if (houseData.length != 0) {
        bookClass.extra = bookClass.extra.filter(e => e !== "breakfast");
        total.textContent = "Totalt: " + bookClass.totalCalc() + " kr";
    }
})

wanderCheck.addEventListener("change", function () {
    if (houseData.length != 0 && !bookClass.extra.includes("wander")) {
        bookClass.extra.push("wander");
        total.textContent = "Totalt: " + bookClass.totalCalc() + " kr";
    }
    else if (houseData.length != 0) {
        bookClass.extra = bookClass.extra.filter(e => e !== "wander");
        total.textContent = "Totalt: " + bookClass.totalCalc() + " kr";
    }
})

seanceCheck.addEventListener("change", function () {
    if (houseData.length != 0 && !bookClass.extra.includes("seance")) {
        bookClass.extra.push("seance");
        total.textContent = "Totalt: " + bookClass.totalCalc() + " kr";
    }
    else if (houseData.length != 0) {
        bookClass.extra = bookClass.extra.filter(e => e !== "seance");
        total.textContent = "Totalt: " + bookClass.totalCalc() + " kr";
    }
})

dayCount.addEventListener("input", function () {
    if (houseData.length != 0) {
        bookClass.days = dayCount.value;
        total.textContent = "Totalt: " + bookClass.totalCalc() + " kr";
    }
})


let id = "";
let houseData = [];

fetch("houses.json")
    .then(response => response.json())
    .then(data => {
        houseData = data;
        id = new URLSearchParams(window.location.search).get("id");
        console.log(id);
        renderHouse(id);
    })

function scareConverter(level) {
    return scareList[level - 1];
}

let skies = ["Klar himmel", "Halvklar himmel", "Molnigt", "Mulet"];

function renderHouse(id) {
    if (isNaN(id)) {
        info.innerHTML =
            `<p class="error">HUSET KUNDE INTE HITTAS - KANSKE HAR DET FÖRSVUNNIT I DIMMAN?</p>`
        info.classList.add("error");
        bookContainer.innerHTML = "";
        bookContainer.style.visibility = "hidden";
        return;
    }
    let curHouse = houseData.filter(h => h.id == id);
    let wifiStatus = curHouse[0].hasWifi ? "WiFi tillgängligt" : "Inget WiFi";
    if (curHouse.length == 0) {
        info.innerHTML =
            `<p class="error">HUSET KUNDE INTE HITTAS - KANSKE HAR DET FÖRSVUNNIT I DIMMAN?</p>`
        info.classList.add("error");
        bookContainer.innerHTML = "";
        bookContainer.style.visibility = "hidden";
        return;
    }
    console.log(curHouse);
    const lat = curHouse[0].coordinates.lat;
    const lng = curHouse[0].coordinates.lng;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,cloud_cover,wind_speed_10m`).then(response => response.json())
        .then(data => {
            let card = document.createElement("div");
            card.innerHTML = `
            <h3>${curHouse[0].name}</h3>
            <p>${curHouse[0].location}</p>
            <p>${curHouse[0].description}</p>
            <p>${curHouse[0].pricePerNight} Kr</p>
            <p class="level${curHouse[0].scareLevel}">${scareConverter(curHouse[0].scareLevel)}</p>
            <p>${curHouse[0].ghostTypes}</p>
            <p>${wifiStatus}</p>
            <h4 class="weather">Väder</h4>
            <p class="weather">
            Temperatur: ${data.current.temperature_2m} ${data.current_units.temperature_2m} | 
            Himmel: ${skies[Math.min(Math.floor(data.current.cloud_cover / 25), 3)]} |
            Vind: ${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}
            </p>
            `
            info.append(card);
            card.classList.add("card");
            bookClass = new Booking(curHouse[0]);
            total.textContent = "Totalt: " + curHouse[0].pricePerNight + " kr";
        })
}

