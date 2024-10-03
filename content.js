console.log("WhatsApp Translator Extension Loaded!");

// Dummy translation function to simulate translation (replace with an actual API later)
function translateText(text, targetLanguage) {
    // Simulate translation with a dummy response (replace with API later)
    console.log(`Translating: "${text}" to "${targetLanguage}"`);
    return `[Translated to ${targetLanguage}]: ${text}`;
}

// Function to translate incoming WhatsApp messages
function translateIncomingMessages() {
    // Select all chat message elements
    const messages = document.querySelectorAll(".message-in .copyable-text");

    messages.forEach(message => {
        const originalText = message.textContent;

        if (originalText && !message.dataset.translated) {
            // Call the translation function (dummy)
            const translatedText = translateText(originalText, "en"); // Translating to English as an example

            // Display the translated message below the original one
            const translatedMessage = document.createElement("div");
            translatedMessage.style.color = "blue";
            translatedMessage.textContent = translatedText;

            message.appendChild(translatedMessage);
            message.dataset.translated = true; // Mark the message as translated to avoid duplicating
        }
    });
}

// Function to translate outgoing WhatsApp messages
async function translateOutgoingMessage() {
    chrome.storage.sync.get(["preferredLanguage", "translationEnabled"], async function (result) {
        if (!result.translationEnabled) return; // Skip translation if disabled

        const targetLanguage = result.preferredLanguage || "en"; // Default to English
        const inputBox = document.querySelector("[title='Type a message']"); // WhatsApp input box

        if (inputBox) {
            const originalMessage = inputBox.innerText; // Grab the typed message
            
            if (originalMessage.trim()) {
                // Translate the message using your translateText function
                const translatedMessage = await translateText(originalMessage, targetLanguage);

                // Clear the input box
                inputBox.innerHTML = ""; 

                // Simulate typing the translated message
                inputBox.innerText = translatedMessage;
                const event = new InputEvent('input', {
                    bubbles: true
                });
                inputBox.dispatchEvent(event);

                // Simulate pressing the "Enter" key to send the translated message
                const enterKeyEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(enterKeyEvent);
            }
        }
    });
}

// Add event listener to detect when the user presses "Enter" to send a message
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) { // Detect "Enter" key without "Shift"
        event.preventDefault(); // Prevent the default action (sending the original message)
        translateOutgoingMessage(); // Call the translation function before the message is sent
    }
});

// Run the function to translate incoming messages every 3 seconds
setInterval(translateIncomingMessages, 3000);

// Add event listener to translate outgoing messages when sending
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        translateOutgoingMessage();
    }
});
