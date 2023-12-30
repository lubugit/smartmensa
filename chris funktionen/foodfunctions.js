const FOOD_LIST = [
	{
		"id":"pizza",
		"ingredients": ["tomato","salami","mushrooms"],
		"nutritional_value": "",
		"allergens": ["tomato","mushrooms"],
		"picture": "pizza.jpg"
	}
]

const WEEKLY_PLAN = [
	{"id": "monday","menuidlist": ["pizza","burger","currywurst","fish"]},
	{"id": "tuesday","menuidlist": ["pizza","burger","currywurst","fish"]},
	{"id": "wednesday","menuidlist": ["pizza","burger","currywurst","fish"]},
	{"id": "thursday","menuidlist": ["pizza","burger","currywurst","fish"]},
	{"id": "friday", "menuidlist": ["pizza","burger","currywurst","fish"]}
]

const LANGUAGE_TRANSLATIONS = [ // Missing: picture language
	{"id":"monday","german":"Montag","english":"Monday"}
	{"id":"tuesday","german":"Dienstag","english":"Tuesday"}
	{"id":"wednesday","german":"Mittwoch","english":"Wednesday"}
	{"id":"thursday","german":"Donnerstag","english":"Thursday"}
	{"id":"friday","german":"Freitag","english":"Friday"}
]

/*
* listtosearch: has to be a list of json objects which have to got a "id" value!
*/
function getobjectbyid(obj_id, listtosearch){
	found_object = null;
	for(let index = 0; index < listtosearch.length;index++){
		if(listtosearch[index].id == obj_id){
			found_object = listtosearch[index];
			return found_object;
		}
	}
	return found_object;
	console.log("Error possible: Couldn't find object in function getobjectbyid");
}

/*
	Functions which are called from HTML
*/


// Gets info on the current selected day
function getweeklyplan(){
	let dayid = document.getElementById("weeklyplanelement").value;
	current_day_obj = getobjectbyid(dayid,WEEKLY_PLAN);
	//var day_info = ;
	menu_list = current_day_obj.menuidlist;
	for(let i = 0;i < menu_list.length;i++){
		current_food_id = menu_list[i]
		console.log(current_food_id);
		var x = document.createElement("BUTTON");
		var t = document.createTextNode(current_food_id); //TODO: Get name from language
		x.appendChild(t);
		document.body.appendChild(x);
	}
}
// Called upon when language selection was changed
function changelanguage(){
	let languageid = document.getElementById("languageselectelement").value;
	// TODO: Do something with this info...
}