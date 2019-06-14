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
