    //click events
    $(document).on('click', "#startTimer-btn", function(){
        console.log("You pressed START");
        
        //starts timer
        start();
    })

    $(document).on('click', "#reset-btn", function(){
        console.log("You pressed RESET");

        //resets timer
        reset();
    })

    $(document).on('click', "#pause-btn", function(){
        console.log("You pressed PAUSE");
        
        //pauses timer
        pause();
    })

    $(document).on('click', "div#workoutInterval-display", function(){
        console.log("You pressed workoutInterval-display");
        
        var workoutForm = $("<form id='workout-form'>");
        var newInput = $("<input type='text'>").val(timeConverter(workoutTotalSeconds));
        workoutForm.append(newInput);
        $("#workout-wrapper").empty().html(workoutForm);

        workoutForm.on("submit", function(event) {
            event.preventDefault();

            //variable for checking workout interval input value
            var workoutInput = newInput.val();
            console.log("the user typed in the time: " + newInput.val());


            // check to make sure both workoutnput and restInput have a colon
            if (!workoutInput.length) {
                workoutInput = timeConverter(workoutTotalSeconds);
            }
            else if (!workoutInput.includes(":")) {
                console.log("User did not put in a semicolon");

                workoutInput = timeConverter(workoutInput);
                console.log(workoutInput);
            }
            console.log("workoutInput", workoutInput);
    

            database.ref().push({
                workoutInterval: workoutInput,
                restInterval: $("#restInterval-display").text(),
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
        });
    });

    $(document).on('click', "div#restInterval-display", function(){
        console.log("You pressed restInterval-display");
        
        var restForm = $("<form id='rest-form'>");
        var newInput = $("<input type='text'>").val(timeConverter(restTotalSeconds));
        restForm.append(newInput);
        $("#rest-wrapper").empty().html(restForm);

        restForm.on("submit", function(event) {
            event.preventDefault();

            //variable for checking workout interval input value
            var restInput = newInput.val();
            console.log("the user typed in the time: " + newInput.val());


            // check to make sure both workoutnput and restInput have a colon
            if (!restInput.length) {
                restInput = timeConverter(restTotalSeconds);
            }
            else if (!restInput.includes(":")) {
                console.log("User did not put in a semicolon");

                restInput = timeConverter(restInput);
                console.log(restInput);
            }
            
            console.log("restInput", restInput);

            database.ref().push({
                workoutInterval: $("#workoutInterval-display").text(),
                restInterval: restInput,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
        });
    })


// My web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDTjMXFqGMoWs8zsxC5EGaTNCl2SWVb75M",
    authDomain: "lazytimer-cqmt.firebaseapp.com",
    databaseURL: "https://lazytimer-cqmt.firebaseio.com",
    projectId: "lazytimer-cqmt",
    storageBucket: "lazytimer-cqmt.appspot.com",
    messagingSenderId: "371231626261",
    appId: "1:371231626261:web:e616b4da860ca636"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

//setInterval starts count and sets the clock to running
var workoutTotalSeconds;
var restTotalSeconds;
var workoutCountdown;
var restCountdown;

database.ref().on("child_added", function(snapshot){
    //stored snapshot value in a variable
    var sv = snapshot.val();

    // console.log("This is the Workout Interval string pulled from firebase: " + sv.workoutInterval);
    // console.log("This is the Rest Interval string pulled from firebase: " + sv.restInterval);

    //splits user input by the : into minutes and seconds, and turns them from string into numbers for the workout interval
    var workoutIntervalMinutes = parseInt(sv.workoutInterval.split(":")[0]);
    var workoutIntervalSeconds = parseInt(sv.workoutInterval.split(":")[1]);

    // console.log("These are the workout minutes: ", workoutIntervalMinutes);
    // console.log("These are the workout seconds: ", workoutIntervalSeconds);

    //converts minutes into seconds and adds it to seconds for total workout duration in seconds
    workoutTotalSeconds = (workoutIntervalMinutes * 60) + workoutIntervalSeconds
    // console.log("These are the total workout seconds", workoutTotalSeconds);
    workoutCountdown = workoutTotalSeconds;

    //splits user input by the : into minutes and seconds and turns them from string into numbers for the rest interval
    var restIntervalMinutes = parseInt(sv.restInterval.split(":")[0]);
    var restIntervalSeconds = parseInt(sv.restInterval.split(":")[1]);
    // console.log("These are the resting minutes: ", restIntervalMinutes)
    // console.log("These are the resting seconds: ", restIntervalSeconds)


    //converts minutes into seconds and adds it to seconds for total rest duration in seconds
    restTotalSeconds = (restIntervalMinutes * 60) + restIntervalSeconds
    // console.log("These are the total resting seconds: ", restTotalSeconds);
    restCountdown = restTotalSeconds;

    //display on HTML
    // $("#workoutInterval-display").text(sv.workoutInterval);
    var workoutDiv = $("<div id='workoutInterval-display' class='notRunning'>").text(sv.workoutInterval);
    $("#workout-wrapper").empty().html(workoutDiv);
    // console.log("This is the workout display: " + sv.workoutInterval);

    // $("#restInterval-display").text(sv.restInterval);
    var restDiv = $("<div id='restInterval-display' class='notRunning'>").text(sv.restInterval);
    $("#rest-wrapper").empty().html(restDiv);
    // console.log("This is the resting display: " + sv.restInterval);

}, function(errorObject){
    console.log("Errors handled:" + errorObject.code);
});

//variable that holds our setInterval to run the stopwatch
var interval;
var workoutInterval;
var restInterval;

//prevents clock from speeding up
var clockRunning = false;

function start(){

    if(!clockRunning){
        interval = setInterval(countdown, 1000);
        clockRunning = true;
        console.log("Is the clock running? " + clockRunning);
    }
}

//converts the time from seconds into a format for display
function timeConverter(t){
    var minutes = Math.floor(t/60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
        seconds = "0" + seconds
    }

    if (minutes === 0) {
        minutes = "00";
    }

    else if (minutes < 10) {
        minutes = "0" + minutes
    }


    return minutes + ":" + seconds;
}

//this variable must be true in order for the workout timer to decrement; else it starts decrementing the resting timer
var workingOut = true;

//decrements workout interval time first, and once it hits zero, moves on to decrement the rest interval time 

var countdown = function() {

    //if workingOut is true and the workout interval is NOT zero, then decrement the timer
    if (workingOut && workoutCountdown != 0) {
		workoutCountdown--;
		console.log(workoutCountdown);

		var displayWorkout = timeConverter(workoutCountdown);
        console.log("This is the total workout seconds display: " + displayWorkout);
        
        //changes display to active running
        $('#workoutInterval-display').removeAttr("class");

		//display the countdown
        $("#workoutInterval-display").text(displayWorkout);
        if(workoutCountdown === 0){
            workingOut = false;
            
            //changes display to not running gray
            $('#workoutInterval-display').attr('class', 'notRunning');
        }	

    //if working out is true and the workout timer is zero, then display the timer, but set workingOut to false
    } if (workingOut && workoutCountdown === 0) {
		var displayWorkout = timeConverter(workoutCountdown);
		console.log("This is the total workout seconds display: " + displayWorkout);

		//display the countdown
        $("#workoutInterval-display").text(displayWorkout);
        if(workoutCountdown === 0){
            workingOut = false;
            $('#workoutInterval-display').removeAttr('class');
            $('#workoutInterval-display').attr('class','inactive');
        }
    }
    
    //decrements rest time if workingOut is false and the restCountdown is not zero
    else if(!workingOut && restCountdown != 0){
        restCountdown--;

        //changes display to active running
        $('#restInterval-display').removeAttr("class");

        var displayRest = timeConverter(restCountdown);
        console.log("This is the total rest seconds timer display: " + displayRest);

        //display the countdown
        $("#restInterval-display").text(displayRest);

        //resets/displays previous workout timer
        workoutCountdown = workoutTotalSeconds
        var displayWorkout = timeConverter(workoutCountdown);
        $("#workoutInterval-display").text(displayWorkout);


    } else if (!workingOut && restCountdown === 0) {
        console.log("Rest timer is starting at zero.");
        
        //resets to previous timer values
        restCountdown = restTotalSeconds
        workoutCountdown = workoutTotalSeconds

        var displayRest = timeConverter(restCountdown);

        $("#restInterval-display").text(displayRest);
        
        //changes display to not running gray
        $('#restInterval-display').attr('class', 'notRunning');

        //enables workout timer to decrement if start is hit again
        workingOut = true;
    }
};


function start(){

    if(!clockRunning){
        interval = setInterval(countdown, 1000);
        clockRunning = true;
        console.log("Is the clock running? " + clockRunning);
    }
}

//clearInterval stops the count and sets clock to not running
function pause (){
    clearInterval(interval);
    clockRunning = false;
    
    //condition checks
    console.log("Are we working out? " + workingOut);
    console.log("Is the timer running? " + clockRunning);
    console.log("What is the current work out interval? " + workoutInterval);
    console.log("What is the current rest interval? " + restInterval);
}

function reset(){
    clearInterval(interval);
    workoutCountdown = workoutTotalSeconds;
    restCountdown = restTotalSeconds;
    clockRunning = false;
    workingOut = true;
    
    $("#workoutInterval-display").text(timeConverter(workoutCountdown));
    $("#restInterval-display").text(timeConverter(restCountdown));

    //condition checks
    console.log("Are we working out? " + workingOut);
    console.log("Is the timer running? " + clockRunning);
    
}