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

var wasOne = false;

var handlers = {
    "profile": updateProfile,
    "speechOutput": readAloud,
    "splitscreen": updateSplitscreen,
    "timer": updateTimer,
}
function updateProfile(response){
    profile = response;
    document.getElementById("nameOfUser").innerHTML = profile.name;
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
        normalscreen.style.border = "0.5rem solid orange";
        splitscreen.style.display = "block";
    }else{
        normalscreen.style.width = "100%";
        normalscreen.style.border = "";
        splitscreen.style.display = "none";
    }
}

function updateTimer(response){
    const timer = document.getElementById("timer");

    if(response.left == -1){
        window.location.href = "smartmensa.html";
    }

    if(response.left <= 0 || wasOne){
        timer.style.visibility = "hidden";

    }else{
        timer.innerHTML = "Zeit bis Logout: " + response.left + "s";
        if(timer.style.color == "black"){
            if(response.left < 5 || response.left > 15){ // Only blink in first 4 seconds and last 4 seconds
                timer.style.color = "red";
            }
        } else {
            timer.style.color = "black";
        }
        //console.log(document.getElementById("selectedFlag"));
        // Language Option in case we are ever gonna implement it...
        /*if(document.getElementById("selectedFlag").src == "picture/USA.png"){
            timer.innerHTML = "Time to logout: " + response.left + "s";
        }*/
        timer.style.visibility = "visible";
    }
    if(response.left == 1){
        wasOne = true;
    }else{
        wasOne = false;
    }
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
                    foodcontainer.innerHTML += '<div class="card food-card" onclick="getinfos(this)" id="' + sortedJson[i].id +'"><img class="food-pic" src="' + sortedJson[i].picture +'" alt="Food ' + i +'"><div class="card-description">'+ sortedJson[i].translatedName + '</div></div>'
                }else{
                    falseFoodContainer.innerHTML += '<div class="card food-card" onclick="getinfos(this)" id="' + sortedJson[i].id +'"><img class="food-pic" src="' + sortedJson[i].picture +'" alt="Food ' + i +'"><div class="card-description">'+ sortedJson[i].translatedName + '</div></div>'
                }
            }

            const deIntolerences = {
                "lactose": "Laktose", 
                "mushrooms": "Pilze", 
                "meat": "Fleisch"
            }

            const reason = document.getElementById("reason");
            if(reason != null){
                reason.innerHTML += deIntolerences[profile.intolerances[0]];
                for(var i = 1; i < profile.intolerances.length;i++){
                    reason.innerHTML += " " + deIntolerences[profile.intolerances[i]];
                }
            }
        });
}