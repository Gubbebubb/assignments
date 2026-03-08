export class Match {
    #Robo1;
    #Robo2;
    #Winner;
    #Loser;
    #CurEle;


    constructor(Robo1, Robo2) {
        this.#Robo1 = Robo1;
        this.#Robo2 = Robo2;
    }

    get R1() {
        return this.#Robo1;
    }
    get R2() {
        return this.#Robo2;
    }
    get RW() {
        return this.#Winner;
    }
    get isPlayed() {
        if (this.#Winner) {
            return true;
        }
        else {
            return false;
        }
    }

    Render() {
        let newDiv = document.createElement("div");
        newDiv.innerHTML = `<h4>${this.#Robo1.name}</h4> <p class="phrase">${this.#Robo1.catchphrase ?? "Jag är en tråkmåns..."}</p> <p class="skill">Level ${this.#Robo1.skillLevel ?? "Ett mysterium..."}</p> <h3>VS</h3> <h4>${this.#Robo2.name}</h4> <p class="phrase">${this.#Robo2.catchphrase ?? "Jag är en tråkmåns..."}</p> <p class="skill">Level ${this.#Robo2.skillLevel ?? "Ett mysterium..."}</p>`;
        this.#CurEle = newDiv;
        return newDiv;
    }

    Fight() {
        let newcomer1 = this.#Robo1.skillLevel ?? (Math.floor(Math.random() * 6) + 3);
        let newcomer2 = this.#Robo2.skillLevel ?? (Math.floor(Math.random() * 6) + 3);
        if ((newcomer1 + Math.floor(Math.random() * 9)) >= (newcomer2 + Math.floor(Math.random() * 10))) {
            this.#Winner = this.#Robo1;
            this.#Loser = this.#Robo2;
        }
        else {
            this.#Winner = this.#Robo2;
            this.#Loser = this.#Robo1;
        }
    }

    showWin() {
        this.#CurEle.innerHTML = `<h4>${this.#Winner.name} är vinnaren!</h4> <p class="phrase">${this.#Winner.catchphrase ?? "Jag är en vinnande tråkmåns..."} <p class="skill">Level ${this.#Winner.skillLevel ?? "Ett mysterium..."}</p>
        <h4 class="loser">${this.#Loser.name} är förloraren...</h4>`;
        this.#CurEle.classList.add("winner");
    }
}