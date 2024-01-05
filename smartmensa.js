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

var profile = {};

var handlers = {
    "profile": updateProfile,
    "speechOutput": readAloud,
    "splitscreen": updateSplitscreen
}
function updateProfile(response){
    profile = response;
}
function readAloud(response){
    if(response.text != ""){
        var msg = new SpeechSynthesisUtterance();
        msg.text = response.text;
        msg.lang = "de";
        window.speechSynthesis.speak(msg);
    }
}

function updateSplitscreen(response){
    const splitscreen = document.getElementById("splitscreen");
    const normalscreen = document.getElementById("normalscreen");

    if(response.enabled){
        normalscreen.style.width = "50%";
        splitscreen.style.display = "block";
    }else{
        normalscreen.style.width = "100%";
        splitscreen.style.display = "none";
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

function loadFoodContent(){
    fetch("./gerichte_real.json")
        .then((response) => response.json())
        .then((json) => {
            const foodcontainer = document.getElementById("foodcontainer");
            const falseFoodContainer = document.getElementById("falseFood");

            var sortedJson = [];

            for(var i = 0; i < json.length;i++){
                if(profile.favourites.includes(json[i].id)){
                    sortedJson.unshift(json[i]);
                }else{
                    sortedJson.push(json[i]);
                }
            }

            for(var i = 0; i < sortedJson.length;i++){
                if(!profile.intolerances.some(val => sortedJson[i].allergens.includes(val))){
                    foodcontainer.innerHTML += '<div class="card food-card" onclick="getinfos(this)" id="' + sortedJson[i].id +'"><img src="' + sortedJson[i].picture +'" alt="Food ' + i +'"><div class="card-description">'+ sortedJson[i].translatedName + '</div></div>'
                }else{
                    falseFoodContainer.innerHTML += '<div class="card food-card" onclick="getinfos(this)" id="' + sortedJson[i].id +'"><img src="' + sortedJson[i].picture +'" alt="Food ' + i +'"><div class="card-description">'+ sortedJson[i].translatedName + '</div></div>'
                }
            }
        });
}