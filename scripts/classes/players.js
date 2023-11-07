import { LENGTHDASHBOARD } from "../constants.js";


export class Players {
    static add(player) {
        const data = JSON.parse(localStorage.getItem("players") ?? "[]"); 

        let index = this.indexOf(player, data);
        if (index != -1) {
            data[index] = player;
        } else {
            let len = data.length;

            if (len < LENGTHDASHBOARD) {
                data.push(player);
            } else {
                for (let i = 0; i < len; i++) {
                    if (data[i].score <= player.score) {
                        data.splice(i, 0, player);
                        data.pop();
                        break;
                    }
                }
            }
        }

        localStorage.setItem("players", JSON.stringify(data));
    }

    static indexOf(player, data) {
        for (let i = 0; i < data.length; i++) {
            if (player.username === data[i].username) {
                return i;
            }
        }

        return -1;
    }

    static getAll() {
        const data = JSON.parse(localStorage.getItem("players") ?? "[]");

        if (data.length > LENGTHDASHBOARD) {
            data = data.splice(0, LENGTHDASHBOARD);
        }

        return data;
    }
}
