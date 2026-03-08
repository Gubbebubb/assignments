import { Match } from "./match.js";

export const curRound = document.getElementById("CR");
export const tournament = document.getElementById("trnm");
export let CR = 0;
export let winners = [];
export let matches = [];
export function Matchmake(contestants) {
    winners = [];
    matches = [];
    if (CR == 1) {
        curRound.textContent = "Semifinal";
    } 
    else if (CR == 2) {
        curRound.textContent = "Final!";
    }
    CR += 1;
    const round = document.createElement("div");
    round.classList.add("round");
    tournament.appendChild(round);
    for (let i = 0; i < contestants.length; i += 2) {
        let match = new Match(contestants[i], contestants[i + 1])
        round.appendChild(match.Render())
        match.Fight();
        winners.push(match.RW);
        matches.push(match);
    }
    return winners;
}