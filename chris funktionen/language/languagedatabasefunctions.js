import dbget from "../databasefunctions.js";
// WOZ Stuff

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

var handlers = {
    "german" : updateLanguage,
    "english" : updateLanguage
};



// Own stuff
// TODO: Create database from data in repository

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