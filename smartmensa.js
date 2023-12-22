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