import { DEFAULTSCORE } from "./constants.js";
import { Player } from "./classes/player.js";


// Functions
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

const disableInputs = (behavoir, ...arr) => {
    arr.forEach(id => {
        document.querySelector(id).disabled = behavoir;
    });
};


// Event Listeners
let player = undefined;

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
         * Show the resutl from local storage to the table.
         */

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
    } else {
        disableInputs(true, "#guess", "#check");
        
        messageKey = "lost";
    }

    player.score--;

    displayResult(messageKey, player);
});

document.querySelector("#try-again").addEventListener("click", () => {
    player = undefined;  // Rest the player
    document.querySelector(".result").textContent = DEFAULTSCORE; // Score [DIV]

    document.querySelector("#username").value = "";  // Username [INPUT]
    document.querySelector("#guess").value = "";  // Guess [INPUT]

    disableInputs(false, "#username", "#guess", "#check")  // Turn the inputs on
    displayResult("default"); // Display the default state
});
