const info = document.getElementById("info");
const bookContainer = document.getElementById("container");

import { Booking } from "./booking.js";
import { scareConverter, fetchJSON } from "./utils.js";

let curHouse = {};

const breakfastCheck = document.getElementById("breakfast");
const wanderCheck = document.getElementById("wander");
const seanceCheck = document.getElementById("seance");
const dayCount = document.getElementById("days");
const couponCheck = document.getElementById("coupon");
const dateSelect = document.getElementById("date");

const errorContainer = document.getElementById("errors");
const success = document.getElementById("success");

const bookBtn = document.getElementById("bookBtn");

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

couponCheck.addEventListener("input", function () {
    if (houseData.length != 0 && couponCheck.value === "GHOST20") {
        bookClass.code = "GHOST20";
        total.textContent = "Totalt: " + bookClass.totalCalc() + " kr";
    }
    else if (houseData.length != 0) {
        bookClass.code = "";
        total.textContent = "Totalt: " + bookClass.totalCalc() + " kr";
    }
})

dateSelect.addEventListener("change", function () {
    bookClass.checkin = new Date(dateSelect.value)
})

bookBtn.addEventListener("click", function () {
    errorContainer.innerHTML = "";
    let validity = bookClass.validate();
    if (validity.length != 0) {
        for (let error of validity) {
            let errorMsg = document.createElement("p");
            errorMsg.textContent = error;
            errorMsg.classList.add("error");
            errorContainer.append(errorMsg);
        }
        return;
    }
    else {
        let extrasList = document.createElement("ul");
        for (let extra of bookClass.extra) {
            let extrasLi = document.createElement("li");
            if (extra == "breakfast") {
                extrasLi.textContent = "Kuslig frukost";
            }
            if (extra == "wander") {
                extrasLi.textContent = "Spökvandring";
            }
            if (extra == "seance") {
                extrasLi.textContent = "Nattlig seans";
            }
            extrasList.append(extrasLi);
        }
        success.innerHTML = `
        <h4>Bokningen lyckades!</h4>
        <p>${curHouse[0].name}</p>
        <p>${bookClass.checkin.toLocaleDateString("sv-SE", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })}</p>
        <p>Antal dagar: ${bookClass.days}</p>
        `
        success.append(extrasList);
        success.innerHTML += `
        <p>Totalt: + ${bookClass.totalCalc()} + kr</p>
        <p>Tack så kusligt mycket! Ha det läskigt!</p>
        `
    }
})

let houseData = [];

async function fetchHouse() {
    try {
        houseData = await fetchJSON("../houses.json")
        let id = new URLSearchParams(window.location.search).get("id");
        if (!id) throw new Error("Id saknas");
        renderHouse(id);
    } catch (error) {
        info.innerHTML = `<p class="error">${error.message}</p>`
        info.classList.add("error");
        bookContainer.innerHTML = "";
        bookContainer.style.visibility = "hidden";
    }
}

fetchHouse();

let skies = ["Klar himmel", "Halvklar himmel", "Molnigt", "Mulet"];

function renderHouse(id) {
    curHouse = houseData.find(h => h.id == id);
    if (!curHouse) {
        info.innerHTML =
            `<p class="error">HUSET KUNDE INTE HITTAS - KANSKE HAR DET FÖRSVUNNIT I DIMMAN?</p>`
        info.classList.add("error");
        bookContainer.innerHTML = "";
        bookContainer.style.visibility = "hidden";
        return;
    }
    let wifiStatus = curHouse.hasWifi ? "WiFi tillgängligt" : "Inget WiFi";
    const lat = curHouse.coordinates.lat;
    const lng = curHouse.coordinates.lng;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,cloud_cover,wind_speed_10m`).then(response => response.json())
        .then(data => {
            let card = document.createElement("div");
            card.innerHTML = `
            <img id="displayed" src="images/${curHouse.image}" alt="${curHouse.name}">
            <h3>${curHouse.name}</h3>
            <p>${curHouse.location}</p>
            <p>${curHouse.description}</p>
            <p>${curHouse.pricePerNight} Kr</p>
            <p class="level${curHouse.scareLevel}">${scareConverter(curHouse.scareLevel)}</p>
            <p>${curHouse.ghostTypes}</p>
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
            bookClass = new Booking(curHouse);
            total.textContent = "Totalt: " + curHouse.pricePerNight + " kr";
        })
        .catch(error => {
            info.innerHTML = `<p class="error">${error.message}</p>`
            info.classList.add("error");
            bookContainer.innerHTML = "";
            bookContainer.style.visibility = "hidden";
        })
}

