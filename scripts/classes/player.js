import { DEFAULTSCORE } from "../constants.js"


export class Player {
    constructor(username) {
        if (!username) {
            const id = Math.trunc(Math.random() * 999);
            username = "player" + id;
        }

        this.username = username;
        this.score = DEFAULTSCORE;
        this.magicNumber = Math.trunc(Math.random() * 99);
    }

    isWon(guess) {
        return guess == this.magicNumber;
    }
}
