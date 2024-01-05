// FROM GMCI TEMPLATE
var loginname = 'admin'
var loginpass = 'admin'

var request = new XMLHttpRequest();

request.onreadystatechange = function() {
    console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
    console.log(request.responseText);
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            handlers[response._id](response);
        }
        if (request.status == 404) {
            var json = JSON.parse(request.responseText);
            if (json.reason === "no_db_file") {
                createDB();
            } else {
                var url = request.responseURL
//              console.log(typeof(url));
                var i = url.lastIndexOf("/", url.length - 1);
                var name = url.substring(i + 1);
                handlers[name]({ "_id" : name });
            }
        }
    }
};

function getCheckedRadio(name) {
    var options = document.getElementsByName(name);
    for (i = 0; i < options.length; i++) {
        var option = options[i];
        if (option.checked) {
            return option.value;
        }
    }
    return null;
}

function set(name) {
    console.log("set::name = " + name);
    console.log("set::GET = " + dburl + name);
    request.open("GET", dburl + name, true);
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
	request.withCredentials = true;
    request.send();
}

function put(response, message) {
    console.log("put::response = " + response);
    console.log("put::message = " + message);
    request.open("PUT", dburl + response._id, true);
    request.setRequestHeader("Content-type", "application/json");
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    message["_id"] = response._id;
    if (response._rev) {
        message["_rev"] = response._rev;
    }
    var s = JSON.stringify(message);
//  console.log("put: " + s);
    request.send(s);
}

function createDB() {
    request.open("PUT", dburl, true);
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    request.send();
}
window.createDB = createDB;
// END GMCI

// MY CODE
var dbname = "smartmensa";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";

var handlers = {
    "profile": setProfile,
    "splitscreen": setSplitscreen,
    "speechOutput": setSpeechOutput
}

function setProfile(response){
    put(response, people[saveProfile]);
}

function setSplitscreen(response){
    put(response, {"enabled": saveSplitscreen});
}

function setSpeechOutput(response){
    put(response, {"text": saveOutput});
}

const ttsAreaParts = [
    // i know how to write but our beatifil tts not ...
    ["Gerichte im Startscreen", "Heute am Mittwoch gibt es Pizza, Currywurst und Pomäs, Bratfisch und Hamburger"],
    ["Möglichkeiten im Startscreen", "Möchtest du dich scannen lassen?"],
    ["Empfehlungen", "Ich empfehle dir Pizza oder Hamburger"],
    ["Sprache wechseln", "Möchtest du auf Deutsch oder Englisch arbeiten?"],
    ["Pizza vorlesen", "Ich kann dir mehr zur Pizza erzählen ..."],
    ["Timer gestartet", "Es wurden mehrere Personen erkannt, du hast noch 20 Sekunden vor dem Bildschirm."],
    ["Timer abgelaufen", "Dein Timer ist abgelaufen, bitte entferne dich vom Bildschirm."]
]
const PEOPLE_COUNT =  2;

var people = [];

var saveProfile = 0

var saveSplitscreen = false;

var saveOutput = "None";

// after loading the website completly
window.onload = function(){
    generateTTSArea();

    loadPeople();
}

function loadPeople(){
    for(var i = 0; i < PEOPLE_COUNT; i++){
        fetch("./people/" + i + ".json")
            .then((response) => response.json())
            .then((json) => {
                people.push(json);
                const scanSelect = document.getElementById("scan_people");
                let option = document.createElement("option");
                option.text = json.name;
                option.value = json.id;
                scanSelect.add(option);
            });
    }
}

/**
 * Simulation of succesfully scanning of a person.
 * 
 * @param {*} select HTML select object
 */
function scanPerson(select){
    const value = select.value;

    saveProfile = value;
    set('profile');
}
window.scanPerson = scanPerson;

/**
 * Simulation of recognition of multiple people.
 */
function toggleSplitscreen(box){
    console.log("Toggled splitscreen");

    saveSplitscreen = box.checked;
    
    set('splitscreen');
}
window.toggleSplitscreen = toggleSplitscreen;

/**
 * To read content aloud in the language.
 * @param {*} content Content to read aloud
 * @param {*} language Language to read aloud
 */
function readAloud(content){
    saveOutput = content;

    set("speechOutput");
    window.setTimeout(function(){
        saveOutput = "";
        set("speechOutput");
    }, 1000);
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