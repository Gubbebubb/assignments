import { asgn } from "../assignments.js";
import { gloNav } from "../global.js";

gloNav(asgn);
//uppgift 1

import * as simulator from "./simulator.js";

const simBtn = document.getElementById("simBtn");
const reBtn = document.getElementById("reBtn");


simBtn.addEventListener("click", function () {
    for (let match of simulator.matches) {
        match.showWin();
    }
    if (simulator.winners.length != 1) {
        simulator.Matchmake(simulator.winners);
    }
    else {
        simBtn.disabled = true;
    }
})

reBtn.addEventListener("click", function () {
    simulator.winners = [];
    simulator.matches = [];
    simulator.CR = 0;
    simBtn.disabled = false;
    simulator.tournament.innerHTML = "";
    simulator.curRound.textContent = "Kvartsfinal"
    fetch("contestants.json").then(Resp => Resp.json()).then(Contestants => {
    simulator.Matchmake(Contestants);
})
});

fetch("contestants.json").then(Resp => Resp.json()).then(Contestants => {
    simulator.Matchmake(Contestants);
})


