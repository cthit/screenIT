const allowhubbenrattanInput = document.getElementById("hubbenrattanCheckbox"); // Set to false to disable hubbenråttan
const hubbenrattanIntervalInput = document.getElementById('hubbenrattanIntervalInput');
const hubbenrattanDisplayTimeInput = document.getElementById('hubbenrattanDisplayTimeInput');

const hubbenrattan = document.getElementById('hubbenrattan');
const hubbenrattanImg = document.getElementById('hubbenrattanImg')
const SpeechBubble = document.getElementById('hubbenrattanSpeechBubble');

let hubbenrattanTimer = setTimeout(() => {
    return
}, 0);;

let hubbenrattanFrequency = localStorage.getItem('hubbenrattanFrequency') || 10 * 1000;
let hubbenrattanDisplayTime = localStorage.getItem('hubbenrattanDisplayTime') || 5 * 1000; // Time until the mosuse is hidden (in milliseconds)

if (localStorage.getItem('allowhubbenrattan') === "true"){
    allowhubbenrattanInput.checked = true;
    hubbenrattanTimer = setTimeout(() => {
        displayhubbenrattan("Mission accepted")
    }, hubbenrattanFrequency); 
}

hubbenrattanDisplayTimeInput.value = hubbenrattanDisplayTime / 1000;
hubbenrattanIntervalInput.value = hubbenrattanFrequency / 1000;










// Easter egg

const hubbenRattanMessages = [
    "Aspa Göken :)",
    "Hubbenråttan gillar eventskärmen",
    "Finns det några popcorn på free-loot hyllan?",
    "Jag undrar vad som händer i The cloud just nu...",
    "nom nom nom, vattenrör är mumsigt", 
    "Jag är en riktig Hubbenråtta!",
    "Du har en fin skärm, kan jag få en bit?",
    "Hmm, jag undrar om det finns något gott i soptunnan...",
    "Röda m&m's är min favorit!",
    "Jag gillar att hänga här!",
    "Är du nervös? Tänk på monster under sängen, de är rädda för mig!",
    "Är du nervös? Tänk på monstertruckar!",
]

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function displayhubbenrattan(message) {
    hubbenrattan.classList.remove("hidden");
    SpeechBubble.textContent = message;

    setTimeout(() => { hubbenrattan.classList.add("hidden"); }, hubbenrattanDisplayTime)

    const newMessage = hubbenRattanMessages[getRandomInt(0, hubbenRattanMessages.length - 1)];

    console.log(allowhubbenrattanInput.value);

    hubbenrattanTimer = setTimeout(() => {
        displayhubbenrattan(newMessage)
    }, hubbenrattanFrequency); 
}

allowhubbenrattanInput.addEventListener('change', () => {
    if (allowhubbenrattanInput.checked) {
        hubbenrattanTimer = setTimeout(() => {
            displayhubbenrattan("Mission accepted")
        }, 0);
        
        localStorage.setItem('allowhubbenrattan', true);
    } else {
        clearTimeout(hubbenrattanTimer);
        localStorage.setItem('allowhubbenrattan', false);
    }
})


hubbenrattanIntervalInput.addEventListener('change', () => {
    let newTime = hubbenrattanFrequency = hubbenrattanIntervalInput.value * 1000;

    if (newTime < (1000)) { 
        newTime = 1000; // if less than 1 seconds, set to 1 seconds
    } else if (newTime < hubbenrattanDisplayTime) {
        newTime = hubbenrattanDisplayTime;
        hubbenrattanIntervalInput.value = newTime / 1000;
    }
    
    hubbenrattanFrequency = newTime;
    localStorage.setItem('hubbenrattanFrequency', hubbenrattanFrequency);

    console.log("Hubbenrattan frequency:", hubbenrattanFrequency);
});

hubbenrattanDisplayTimeInput.addEventListener('change', () => {
    let newTime = hubbenrattanDisplayTime = hubbenrattanDisplayTimeInput.value * 1000;

    if (newTime < (1000)) { 
        newTime = 1000; // if less than 1 seconds, set to 1 seconds
    } else if (newTime > hubbenrattanFrequency){
        newTime = hubbenrattanFrequency;
        hubbenrattanDisplayTimeInput.value = newTime / 1000;
    }
    hubbenrattanDisplayTime = newTime;
    localStorage.setItem('hubbenrattanDisplayTime', hubbenrattanDisplayTime);

    console.log("Hubbenrattan display time:", hubbenrattanDisplayTime);
});