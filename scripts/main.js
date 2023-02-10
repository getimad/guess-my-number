import { DEFAULTSCORE } from "./constants.js";
import { Player } from "./classes/player.js";


// *** Functions ***
const displayResult = (messageKey = "empty", player = undefined) => {
    const messages = new Map(
        [["empty", {content:"Please enter your guess number.", bagroundColor:"#A6BB8D", fontColor:"#FF980E"}],    
        ["default", {content:"Guess my number", bagroundColor:"#A6BB8D", fontColor:"#3C6255"}],
        ["small", {content:"Your guess is small", bagroundColor:"#FF980E", fontColor:"#FFFFFF"}],
        ["verySmall", {content:"Your guess is very small", bagroundColor:"#D3212C", fontColor:"#FFFFFF"}],
        ["large", {content:"Your guess is large", bagroundColor:"#FF980E", fontColor:"#FFFFFF"}],
        ["veryLarge", {content:"Your guess is very large", bagroundColor:"#D3212C", fontColor:"#FFFFFF"}],
        ["correct", {content:"Congratulation! 🎉 Your guess is correct!", bagroundColor:"#006B3D", fontColor:"#FFFFFF"}],
        ["lost", {content:"You lost 😭", bagroundColor:"#A6BB8D", fontColor:"#D3212C"}]]
    );

    document.querySelector(".result").textContent = player ? player.score : DEFAULTSCORE;

    const obj = messages.get(messageKey);

    document.querySelector("#message").textContent = obj.content;
    document.querySelector("#message").style.color = obj.fontColor;

    document.querySelector(".title-card").style.background = obj.bagroundColor;
};

const displayDashboard = (data) => {
    const medals = ["#FFD700", "#C0C0C0", "#CD7F32"];

    let html = "";
    data.forEach((item, index) => {
        html += `<tr style="color:${medals[index]}"><td>${(index + 1)}<td>${item.username}<td>${item.score}`;
    });

    document.querySelector("#data").innerHTML = html;      
}

const disableInputs = (behavoir, ...arr) => {
    arr.forEach(id => {
        document.querySelector(id).disabled = behavoir;
    });
};

const addPlayer = (player, data) => {
    if (!data.length) {
        data.push(player);
    } else {
        let isExist = false
        for (let i = 0; i < data.length; i++) {
            if (player.username == data[i].username && player.score > data[i].score) {
                isExist = true;
                break;
            }
        }

        if (isExist) {
            data[i] = player;
        } else {
            for (let i = 0; i < data.length; i++) {
                if (player.score >= data[i].score) {
                    data.splice(i, 0, player);
                    break;
                }
            }
        }
    }

    return data.slice(0, 7);
};


// Get data from local storage and display it.
displayDashboard(JSON.parse(localStorage.getItem("players") || "[]"))

// *** Event Listeners ***
let player = undefined;

// Check Button
document.querySelector("#check").addEventListener("click", () => {
    if (!player) {
        const username = document.querySelector("#username");

        player = new Player(username.value);

        username.value = player.username;
        disableInputs(true, "#username");
    }

    const guess = document.querySelector("#guess").value;

    if (!guess) {
        displayResult();
        return;
    }
    
    let messageKey = "default";

    if (player.isWon(guess)) {
        /**
         * Add the player object to the Local Storage.
         * Display the result to the dashboard.
         */

        disableInputs(true, "#guess", "#check");

        const data = addPlayer(player, JSON.parse(localStorage.getItem("players") || "[]"));

        localStorage.setItem("players", JSON.stringify(data));

        displayDashboard(data);

        messageKey = "correct";
    } else if (player.score > 1) {     
        const AROUNDNUMBER = 20;
        
        if (guess > player.magicNumber) {
            if (guess > player.magicNumber + AROUNDNUMBER) {
                messageKey = "veryLarge";
            } else {
                messageKey = "large";
            }
        } else if (guess < player.magicNumber) {
            if (guess < player.magicNumber - AROUNDNUMBER) {
                messageKey = "verySmall";
            } else {
                messageKey = "small";
            }
        }

        player.score--;
    } else {
        disableInputs(true, "#guess", "#check");
        
        player.score--;
        
        messageKey = "lost";
    }

    displayResult(messageKey, player);
});

// Try Agrain Button
document.querySelector("#try-again").addEventListener("click", () => {
    /**
     * Reset the player object.
     * Reset the page by removing the value of the inputs and enable them again.
     */

    player = undefined;

    document.querySelector(".result").textContent = DEFAULTSCORE;

    document.querySelector("#username").value = ""; 
    document.querySelector("#guess").value = "";

    disableInputs(false, "#username", "#guess", "#check");
    displayResult("default");
});
