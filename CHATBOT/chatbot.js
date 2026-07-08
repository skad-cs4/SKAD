// ==========================
// ELEMENTS
// ==========================

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");


// ==========================
// SEND MESSAGE
// ==========================

function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") return;

    // USER MESSAGE
    addMessage(message, "user-message");

    // NYX RESPONSE
    const response = getNyxResponse(message);

    setTimeout(() => {
        addMessage(response, "bot-message");
    }, 500);

    // CLEAR INPUT
    userInput.value = "";
}


// ==========================
// ADD MESSAGE
// ==========================

function addMessage(text, className) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add(className);

    messageDiv.textContent = text;

    chatBox.appendChild(messageDiv);

    // AUTO SCROLL
    chatBox.scrollTop = chatBox.scrollHeight;
}


// ==========================
// EVENTS
// ==========================

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});