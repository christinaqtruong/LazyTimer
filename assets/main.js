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
    event.preventDefault();
    
    workoutInterval = $("#workoutInterval-input").val().trim();
    restInterval = $("#restInterval-input").val().trim();
    
    console.log("workoutInterval", workoutInterval);
    console.log("restInterval", restInterval);
    
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

    console.log("workoutIntervalMinutes", workoutIntervalMinutes);
    console.log("workoutIntervalSeconds", workoutIntervalSeconds);

    //converts minutes into seconds and adds it to seconds for total workout duration in seconds
    workoutTotalSeconds = (workoutIntervalMinutes * 60) + workoutIntervalSeconds
    console.log("workoutTotalSeconds", workoutTotalSeconds);

    //splits user input by the : into minutes and seconds and turns them from string into numbers for the rest interval
    var restIntervalMinutes = parseInt(sv.restInterval.split(":")[0]);
    var restIntervalSeconds = parseInt(sv.restInterval.split(":")[1]);
    console.log("These are the resting minutes: " + restIntervalMinutes + ".")
    console.log("These are the resting seconds: " + restIntervalSeconds + ".")


    //converts minutes into seconds and adds it to seconds for total workout duration in seconds
    restTotalSeconds = (restIntervalMinutes * 60) + workoutIntervalSeconds
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
var workingOut = true;

//setInterval starts count and sets the clock to running
function start(){

    if(!clockRunning){
        interval = setInterval(countdown, 1000);
        clockRunning = true;
    }
}

//decrements workout interval time first, and once it hits zero, moves on to decrement the rest interval time 
function countdown(){
    if (workingOut) {
        workoutTotalSeconds--;

        //get the current time and display it
        // var convertedWorkoutInterval = timeConverter(workoutInterval);
        var seconds = workoutTotalSeconds;
        var duration = moment.duration(seconds, 'seconds');
        var formattedWorkout = duration.format("hh:mm:ss");
        console.log(formattedWorkout);

        //display the countdown
        $("#workoutInterval-display").text(formattedWorkout);

        if (workoutTotalSeconds === 0) {
            workingOut = false;
        }
    }
    else {
        //decrements rest time
        restTotalSeconds--;

        //get the current time and display it
        // var convertedRestInterval = timeConverter(restInterval);
        var seconds = restTotalSeconds;
        var duration = moment.duration(seconds, 'seconds');
        var formattedRest = duration.format("hh:mm:ss");
        console.log(formattedRest);

        //display the countdown
        $("#restInterval-display").text(formattedRest);

    }
    
}

//clearInterval stops the count and sets clock to not running
function pause (){
    clearInterval(interval);
    clockRunning = false;
}