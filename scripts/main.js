// It is very complex to write vanila javascript for new projects.
// Use Blazor, React or Angular for HAPPY LIFE.


import { DEFAULTSCORE, AROUNDNUMBER } from "./constants.js";
import { Player } from "./classes/player.js";
import { Players } from "./classes/players.js";


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

displayDashboard(Players.getAll());

// *** Event Listeners ***
let player = undefined;

// Check Button
document.querySelector("#check").addEventListener("click", () => {
    if (!player) {
        const username = document.querySelector("#username");

        player = new Player(username.value);

        disableInputs(true, "#username");
    }

    const guess = document.querySelector("#guess").value;

    if (!guess) {
        displayResult();
        return;
    }
    
    let messageKey = "default";

    if (guess == player.magicNumber) {
        disableInputs(true, "#guess", "#check");

        Players.add(player);
        displayDashboard(Players.getAll());

        messageKey = "correct";
    } else if (player.score > 1) {     
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

// Reset All Inputs
document.querySelector("#try-again").addEventListener("click", () => {
    player = undefined;

    document.querySelector(".result").textContent = DEFAULTSCORE;

    document.querySelector("#username").value = ""; 
    document.querySelector("#guess").value = "";

    disableInputs(false, "#username", "#guess", "#check");
    displayResult("default");
});
