import { DEFAULTSCORE } from "../constants.js"


export class Player {
    constructor(username) {
        if (!username) {
            const id = Math.trunc(Math.random() * 9999);
            username = "player_" + id;
        }

        this.username = username;
        this.score = DEFAULTSCORE;
        this.magicNumber = Math.trunc(Math.random() * 99);
    }
}
