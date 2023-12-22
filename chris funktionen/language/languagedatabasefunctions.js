// WOZ Stuff
var loginname = 'admin'
var loginpass = 'admin'

var dbname = "language";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";

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

function update() {
    for (var name in handlers) {
        // console.log("updating " + name);
        dbget(name);
    }
}

// request updates at a fixed interval (ms)
//var intervalID = setInterval(update, 1000);



var handlers = {
    "german" : updateLanguage,
    "english" : updateLanguage
};



// Own stuff
// TODO: Create database from data in repository
function dbget(databasename,variable) {
    // console.log("get " + variable);
	//let cdburl = "http://127.0.0.1:5984/" + databasename + "/";
    //request.open("GET", cdburl + variable, false);
    request.open("GET", dburl + variable, false);
	//request.setRequestHeader("Authorization", "Basic " + btoa("cdeutzer" + ":" + "NiunCrL01HnbcfZf2As2"));
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    request.send();
}

// Change language elements in document
function getLanguage() {
	let languageid = document.getElementById("languageelement").value;
	dbget("language",languageid);
}

function devtest(){
	console.log("ICH WURDE GEWÄHLT!");
}

function updateLanguage(response){
	// Update HTML Elements
	recommendationelement.innerHTML = response.recommendations;
	weekly_planelement.innerHTML = response.weekly_plan;
}