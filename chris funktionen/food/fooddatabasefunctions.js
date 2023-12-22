// WOZ Stuff
var loginname = 'admin'
var loginpass = 'admin'

var dbname = "gmci";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";

var request = new XMLHttpRequest();

var fooddbcreated = false;

request.onreadystatechange = function() {
    // console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
    // console.log(request.responseText);
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            handlers[response._id](response);
			console.log(response._id);
        }
        if (request.status == 404) {
			var json = JSON.parse(request.responseText);
            if (json.reason === "no_db_file") {
                //createDB("food");
			} 
			else {
				console.log("not found: " + request.responseText);
			}
        }
		if(request.status == 201){ // Database created
			if (request.responseURL == "http://127.0.0.1:5984/food/") {
				fooddbcreated = true;
				dbput("http://127.0.0.1:5984/" + "food" + "/", "pizza",{
					"ingredients": ["tomato","salami","mushrooms"],
					"nutritional_value": "",
					"allergens": ["tomato","mushrooms"],
					"picture": "pizza.jpg"
				});
			}
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
    "monday" : updateday,
    "tuesday" : updateday,
    "wednesday" : updateday,
    "thursday" : updateday,
    "friday" : updateday,
	
	"pizza": updatefooddetails
};



// Own stuff

// TODO: Create database from data in repository
function createDB(databasename){
	let cdburl = "http://127.0.0.1:5984/" + databasename + "/";
	request.open("PUT", cdburl, true);
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    request.send();
}

function dbput(databaseurl, id, message) {
    request.open("PUT", databaseurl + id, true);
    request.setRequestHeader("Content-type", "application/json");
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    message["_id"] = id;
    /*if (response._rev) {
        message["_rev"] = response._rev;
    }*/
    var s = JSON.stringify(message);
    request.send(s);
}

function createfoodDB(){
	if(!fooddbcreated){
		createDB("food");
	}
}

// Get Methods
function dbget(databasename,variable) {
    // console.log("get " + variable);
	let cdburl = "http://127.0.0.1:5984/" + databasename + "/";
    request.open("GET", cdburl + variable, false);
	//request.setRequestHeader("Authorization", "Basic " + btoa("cdeutzer" + ":" + "NiunCrL01HnbcfZf2As2"));
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    request.send();
}

// Von einem Tag daten laden
function getweeklyplan() {
	let dayid = document.getElementById("weeklyplanelement").value;
	dbget("weeklyplan",dayid);
}

function updateday(response){
	// Update HTML Elements
	gerichteelement.innerHTML = response.menuidlist;
}

// Details zu einem Gericht laden
function getfooddetails(gerichtid){
	dbget("food",gerichtid);
}

function updatefooddetails(response){
	//fooddetailselement.innerHTML = response;
	console.log(response);
}

// Output auf consolentest für Funktionen
function devtest(){
	console.log("ICH WURDE GEWÄHLT!");
}