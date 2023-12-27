import { timer } from "./smartmensa.js";

const ttsAreaParts = [
    ["Gerichte im Startscreen", "Heute am Mittwoch gibt es Pizza, Currywurst und Pommes, Bratfisch und Hamburger"],
    ["Möglichkeiten im Startscreen", "Möchtest du dich scannen lassen?"],
    ["Empfehlungen", "Ich empfehle dir Pizza oder Hamburger"],
    ["Sprache wechseln", "Möchtest du auf Deutsch oder Englisch arbeiten?"],
    ["Pizza vorlesen", "Ich kann dir mehr zur Pizza erzählen ..."],
    ["Timer gestartet", "Es wurden mehrere Personen erkannt, du hast noch 20 Sekunden vor dem Bildschirm."],
    ["Timer abgelaufen", "Dein Timer ist abgelaufen, bitte entferne dich vom Bildschirm."]
]

window.timer = timer;

// after loading the website completly
window.onload = function(){
    generateTTSArea();
}

/**
 * Simulation of succesfully scanning of a person.
 * 
 * @param {*} select HTML select object
 */
function scanPerson(select){
    const value = select.value;
    const person = select[value].text;

    console.log("You selected " + person + "("+value+")");
}
window.scanPerson = scanPerson;

/**
 * Simulation of recognition of multiple people.
 */
function toggleSplitscreen(box){
    console.log("Toggled splitscreen");

    if(box.checked){
        console.log("Splitscreen on");
    }else{
        console.log("Splitscreen off");
    }
}
window.toggleSplitscreen = toggleSplitscreen;

/**
 * To read content aloud in the language.
 * @param {*} content Content to read aloud
 * @param {*} language Language to read aloud
 */
function readAloud(content, lang){
    var msg = new SpeechSynthesisUtterance();
    msg.text = content;
    msg.lang = "de";
    window.speechSynthesis.speak(msg);
}
window.readAloud = readAloud;

/**
 * Filling the text-to-speach area with usable buttons.
 */
function generateTTSArea(){
    const ttsArea = document.getElementById("ttsArea");

    for(var i = 0; i < ttsAreaParts.length;i++){
        ttsArea.innerHTML += "<button onclick=\"readAloud('"+ ttsAreaParts[i][1]+ "')\">"+ ttsAreaParts[i][0]+ "</button>";
    }
}
window.generateTTSArea = generateTTSArea;