// GMCI TEMPLATE

var loginname = 'admin'
var loginpass = 'admin'

var request = new XMLHttpRequest();

request.onreadystatechange = function() {
    // console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
    // console.log(request.responseText);
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            handlers[response._id](response);
        }
        if (request.status == 404) {
            console.log("not found: " + request.responseText);
        }
    }
};

function get(variable) {
    // console.log("get " + variable);
    request.open("GET", dburl + variable, false);
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    request.send();
}

function update() {
    for (var name in handlers) {
        // console.log("updating " + name);
        if(name != "profile"){
            get(name);
        }
    }
}

// request updates at a fixed interval (ms)
var intervalID = setInterval(update, 1000);

// MY CODE
var dbname = "smartmensa";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";

var handlers = {
    "profile": updateProfile,
    "speechOutput": readAloud
}
function updateProfile(response){
    console.log(response);
    //document.getElementById("test").innerHTML = response.name;
}
function readAloud(response){
    if(response.text != ""){
        var msg = new SpeechSynthesisUtterance();
        msg.text = response.text;
        msg.lang = "de";
        window.speechSynthesis.speak(msg);
    }
}
/**
 * Seconds timer.
 * @param {*} sec how many seconds you have
 */
function timer(sec){
    console.log("Du hast " + sec + " Sekunden");

    var passed = 0;
    let myTimer = setInterval(function(){
        passed += 1;
        let remainder = sec - passed;
        console.log("Du hast noch " + remainder + " Sekunden");

        if(remainder == 0){ // to end timer after expiration
            window.clearInterval(myTimer);
        }
    }, 1000);
}

function scan(){
    get('profile');
}