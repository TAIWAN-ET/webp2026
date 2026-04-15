let firstChar = "";
let stringContent = "";
let wrongStreak = 0;

function randomLowerChar() {
    return String.fromCharCode(97 + Math.floor(Math.random() * 26));
}

function generateRandomChunk() {
    // Keep the original behavior from ex6: append 1-3 chars when wrong.
    const newCharCount = 1 + Math.floor(Math.random() * 3);
    let chunk = "";

    for (let i = 0; i < newCharCount; i++) {
        chunk += randomLowerChar();
    }

    return chunk;
}

function generateInitialString() {
    // Initial string length is 0-2 chars.
    const randomCount = Math.floor(Math.random() * 3);
    stringContent = "";

    for (let i = 0; i < randomCount; i++) {
        stringContent += randomLowerChar();
    }

    firstChar = stringContent.length > 0 ? stringContent[0] : "";
}

function updateDisplay() {
    const container = document.getElementById("container");
    const firstCharSpan = document.getElementById("first-char");
    const wrongStreakSpan = document.getElementById("wrong-streak");

    if (firstChar) {
        // Highlight the target character using innerHTML.
        container.innerHTML = `<span class="text-danger fw-bold">${firstChar}</span>${stringContent.slice(1)}`;
        firstCharSpan.textContent = firstChar;
    } else {
        container.textContent = "";
        firstCharSpan.textContent = "(空)";
    }

    wrongStreakSpan.textContent = String(wrongStreak);
}

window.onload = function() {
    generateInitialString();
    updateDisplay();
};

window.addEventListener("keyup", function(e) {
    if (!e.key || !e.key.match(/^[a-z]$/i)) {
        return;
    }

    if (e.key.toLowerCase() === firstChar) {
        stringContent = stringContent.substring(1);
        firstChar = stringContent.length > 0 ? stringContent[0] : "";
        wrongStreak = 0;
    } else {
        // Original append.
        stringContent += generateRandomChunk();
        wrongStreak += 1;

        // New ex7 rule: after 3 consecutive wrong keys, add 3 extra random chunks.
        if (wrongStreak === 3) {
            stringContent += generateRandomChunk();
            stringContent += generateRandomChunk();
            stringContent += generateRandomChunk();
            wrongStreak = 0;
        }

        if (!firstChar && stringContent.length > 0) {
            firstChar = stringContent[0];
        }
    }

    updateDisplay();
});
