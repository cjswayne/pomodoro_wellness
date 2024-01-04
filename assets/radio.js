/*
Select genre (have list of preselected genres)
toggle for turning radio on and off
volume?
shuffle button
next station/previous station
*/


// var tag = 'jazz';

// // Make a GET request to the Radio Browser API
// $.ajax({
//     url: 'https://de1.api.radio-browser.info/json/stations/bytag/' + tag,
//     method: 'GET',
//     success: function(data) {
//         console.log(data);
//         // Filter stations to find those in the United States
//         var americanJazzStations = data.filter(function(station) {
//             return station.countrycode.toLowerCase() === 'us';
//         });

//         // Log the filtered American jazz stations
//         console.log(americanJazzStations);

//         // Optional: Play the first American jazz station
//         if (americanJazzStations.length > 0) {
//             let firstStationUrl = americanJazzStations[0].url;
//             let audio = new Audio(firstStationUrl);
//             audio.play();
//         }

//         // Process the data to display or use the stations as needed
//         // Example: Listing the names of the American jazz stations
//         // americanJazzStations.forEach(function(station) {
//         //   console.log(station.name);
//         // });
//     },
//     error: function(error) {
//         console.error('Error fetching stations:', error);
//     }
// });

// fxn to start/stop radio

// fxn select genre


$(document).ready(function() {
    $('#genre-select').change(function(){
        var selectedGenre = $(this).val();
        console.log(selectedGenre);

    });

});
