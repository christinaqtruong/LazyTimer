//when window loads, it initiates all the button functions
window.onload = function(){
    //click events
    $(document).on('click', "#startTimer-btn", function(){
        //starts timer
        start();
    })

    // $(document).on('click', "#reset-btn", function(){
    //     //resets timer
    //     reset();
    // })

    // $(document).on('click', "#pause-btn", function(){
    //     //resets timer
    //     pause();
    // })
};

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

//clicking submit button grab input values and pushes it to firebase
$("#submit-btn").on("click", function(event){
    
    console.log("The submit button was pressed")

    //prevents default submit button function
    event.preventDefault();
    
    //variable for checking workout interval input value
    var workoutInput = $("#workoutInterval-input").val().trim();

    //if there is not input value, set the workout interval to 00:00 by default, else take the user input
    if(workoutInput === ""){
        console.log("No Workout Interval set")
        workoutInterval = "00:00";
    } else {
        workoutInterval = $("#workoutInterval-input").val().trim();
        console.log("The user has set the Workout Interval to: ", workoutInterval);
    }
    
    //variable for checking workout interval input value
    var restInput = $("#restInterval-input").val().trim();

    //if there is not input value, set the rest interval to 00:00 by default, else take the user input
    if(restInput === ""){
        console.log("No rest Interval set")
        restInterval = "00:00";
    } else {
        restInterval = $("#restInterval-input").val().trim();
        console.log("The user has set the Rest Interval to: ", restInterval);
    }

    //grab the user inputs and shove it up to firebase
    database.ref().push({
        workoutInterval: workoutInterval,
        restInterval: restInterval,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    
});

database.ref().on("child_added", function(snapshot){
    //stored snapshot value in a variable
    var sv = snapshot.val();

    console.log(sv.workoutInterval);
    console.log(sv.restInterval);

    //splits user input by the : into minutes and seconds, and turns them from string into numbers for the workout interval
    var workoutIntervalMinutes = parseInt(sv.workoutInterval.split(":")[0]);
    var workoutIntervalSeconds = parseInt(sv.workoutInterval.split(":")[1]);

    console.log("These are the workout minutes", workoutIntervalMinutes);
    console.log("These are the workout seconds", workoutIntervalSeconds);

    //converts minutes into seconds and adds it to seconds for total workout duration in seconds
    workoutTotalSeconds = (workoutIntervalMinutes * 60) + workoutIntervalSeconds
    console.log("These are the total workout seconds", workoutTotalSeconds);

    //splits user input by the : into minutes and seconds and turns them from string into numbers for the rest interval
    var restIntervalMinutes = parseInt(sv.restInterval.split(":")[0]);
    var restIntervalSeconds = parseInt(sv.restInterval.split(":")[1]);
    console.log("These are the resting minutes: " + restIntervalMinutes + ".")
    console.log("These are the resting seconds: " + restIntervalSeconds + ".")


    //converts minutes into seconds and adds it to seconds for total rest duration in seconds
    restTotalSeconds = (restIntervalMinutes * 60) + restIntervalSeconds
    console.log("These are the total resting seconds: " + restTotalSeconds + ".")

    //display on HTML
    $("#workoutInterval-display").text(sv.workoutInterval);
    console.log("This is the workout display: " + sv.workoutInterval);

    $("#restInterval-display").text(sv.restInterval);
    console.log("This is the resting display: " + sv.restInterval);

}, function(errorObject){
    console.log("Errors handled:" + errorObject.code);
});

//variable that holds our setInterval to run the stopwatch
var interval;

var workoutInterval;
var restInterval;

//prevents clock from speeding up
var clockRunning = false;

//setInterval starts count and sets the clock to running
function start(){

    if(!clockRunning){
        interval = setInterval(countdown, 1000);
        clockRunning = true;
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

//variables to control when workout countdown starts/stops and rest countdown starts/stops
var workingOut = true;
var resting = true;

//decrements workout interval time first, and once it hits zero, moves on to decrement the rest interval time 
function countdown(){
    if (workingOut) {
        workoutTotalSeconds--;

        //get the current time and display it
        var seconds = workoutTotalSeconds;
        var duration = moment.duration(seconds, 'seconds');
        var formattedWorkout = duration.format("hh:mm:ss");
        console.log(formattedWorkout);

        var displayWorkout = timeConverter(formattedWorkout);
        console.log(displayWorkout);

        //display the countdown
        $("#workoutInterval-display").text(displayWorkout);

        if (workoutTotalSeconds === 0) {
            workingOut = false;
        }
    }
    else {
        //decrements rest time
        restTotalSeconds--;

        //get the current time and display it
        var seconds = restTotalSeconds;
        var duration = moment.duration(seconds, 'seconds');
        var formattedRest = duration.format("hh:mm:ss");
        console.log(formattedRest);

        var displayRest = timeConverter(formattedRest);
        console.log(displayRest);

        //display the countdown
        $("#restInterval-display").text(displayRest);

        //once resting time hits zero, either repeat the function or stop the timer
        if(restTotalSeconds === 0) {
            clearInterval(interval);
        }

    };
    
}

//clearInterval stops the count and sets clock to not running
function pause (){
    clearInterval(interval);
    clockRunning = false;
}