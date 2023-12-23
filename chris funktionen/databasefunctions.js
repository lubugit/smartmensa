var loginname = 'admin'
var loginpass = 'admin'


export const dbip = "http://127.0.0.1:5984/";

export function dbget(databasename,variable) {
    // console.log("get " + variable);
	let cdburl = dbip + databasename + "/";
    request.open("GET", cdburl + variable, false);
	//request.setRequestHeader("Authorization", "Basic " + btoa("cdeutzer" + ":" + "NiunCrL01HnbcfZf2As2"));
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    request.send();
}

export function createDB(databasename){
	let cdburl = dbip + databasename + "/";
	request.open("PUT", cdburl, true);
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    request.send();
}

export function dbput(databaseurlextension, id, message) {
    request.open("PUT", dbip + databaseurlextension + id, true);
    request.setRequestHeader("Content-type", "application/json");
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    message["_id"] = id;
    /*if (response._rev) {
        message["_rev"] = response._rev;
    }*/
    var s = JSON.stringify(message);
    request.send(s);
}