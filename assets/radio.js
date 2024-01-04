/*
Select genre (have list of preselected genres)
toggle for turning radio on and off
volume?
shuffle button
next station/previous station
*/


var tag = 'jazz';

// Make a GET request to the Radio Browser API
$.ajax({
    url: 'https://de1.api.radio-browser.info/json/stations/bytag/' + tag,
    method: 'GET',
    success: function(data) {
        // Filter stations to find those in the United States
        var americanJazzStations = data.filter(function(station) {
            return station.country.toLowerCase() === 'united states';
        });

        // Log the filtered American jazz stations
        console.log(americanJazzStations);

        // Optional: Play the first American jazz station
        if (americanJazzStations.length > 0) {
            let firstStationUrl = americanJazzStations[0].url;
            let audio = new Audio(firstStationUrl);
            audio.play();
        }

        // Process the data to display or use the stations as needed
        // Example: Listing the names of the American jazz stations
        // americanJazzStations.forEach(function(station) {
        //   console.log(station.name);
        // });
    },
    error: function(error) {
        console.error('Error fetching stations:', error);
    }
});

// $(document).ready(function() {
//     $.ajax({
//         url: 'http://www.radio-browser.info/webservice/json/stations/bytag/jazz',
//         method: 'GET',
//         success: function(stations) {
//             // Filter stations by country (USA)
//             var americanJazzStations = stations.filter(function(station) {
//                 return station.country === 'United States';
//             });

//             // Process the list of American jazz stations
//             console.log(americanJazzStations);
//         },
//         error: function(error) {
//             console.log('Error:', error);
//         }
//     });
// });

// fxn to start/stop radio

// fxn 