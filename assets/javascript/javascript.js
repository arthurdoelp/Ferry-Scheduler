$(document).ready(function() {

    var database = firebase.database();

    $("#add-ferry-button").on("click", function(event) {
        event.preventDefault();
  
        // Grabs user input
        var ferryName = $("#ferry-name-text").val().trim();
        var ferryDestination = $("#destination-text").val().trim();
        var ferryStartTime = moment($("#time-text").val().trim(), "hh:mm").format("X");
        var ferryFrequency = $("#frequency-text").val().trim();
  
        // Creates local "temporary" object for holding newFerry data
        var newFerry = {
            name: ferryName,
            destination: ferryDestination,
            start: ferryStartTime,
            frequency: ferryFrequency
        };
  
        // Uploads ferry data to the database
        database.ref().push(newFerry);
  
        alert("Employee successfully added");
  
        // Clears all of the text-boxes
        $("#ferry-name-text").val("");
        $("#destination-text").val("");
        $("#time-text").val("");
        $("#frequency-text").val("");
    });

    database.ref().on("child_added", function(childSnapshot) {
  
        // Store every piece of data from the database into a variable.
        var ferryName = childSnapshot.val().name;
        var ferryDestination = childSnapshot.val().destination;
        var ferryStartTime = childSnapshot.val().start;
        var ferryFrequency = childSnapshot.val().frequency;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(ferryStartTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % ferryFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillFerry = ferryFrequency - tRemainder;
        console.log("MINUTES TILL FERRY: " + tMinutesTillFerry);

        // Next Train
        var nextFerry = moment().add(tMinutesTillFerry, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextFerry).format("hh:mm"));
        var nextFerryDisplay = moment(nextFerry).format("hh:mm");
 
        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(ferryName),
            $("<td>").text(ferryDestination),
            $("<td>").text(ferryFrequency),
            $("<td>").text(nextFerryDisplay),
            $("<td>").text(tMinutesTillFerry)
        );
  
        // Append the new row to the table
        $("#ferry-schedule-table > tbody").append(newRow);
    });

        var APIKey = "166a433c57516f51dfab1f7edaed8413";

        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=Venezia&units=imperial&appid=" + APIKey;

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        // We store all of the retrieved data inside of an object called "response"
        .then(function(response) {

            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);

            // Transfer content to HTML
            $("#weather-icon").html("<img src='http://openweathermap.org/img/w/" + response.weather[0].icon + ".png' width='75px'>");
            $("#temp").prepend("" + response.main.temp);
            $("#desc").text(response.weather[0].description);
            $("#temp-max").prepend("H: " + response.main.temp_max);
            $("#temp-min").prepend("L: " + response.main.temp_min);
        });
});
