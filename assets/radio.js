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

// fxn to populate genre options
function fillGenreOptions(){
    var genres = [
        "jazz", 
        "lofi",
        "music for study",
        "hip hop",
        "classical",
        "ambient and relaxation music",
        "relax",
        "focus radio"
        ]

    var $select = $('#genre-select')

    $.each(genres, function(index, value){
        $select.append($('<option></option>').val(value).html(titleize(value)));
    });
}

// fxn to titleize a string
function titleize(str){
    return str.replace(/\w\S*/g, function(txt){
        const lowerCaseWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'in', 'at', 'to', 'from', 'by'];
        return lowerCaseWords.includes(txt.toLowerCase()) && txt !== str[0]
            ? txt.toLowerCase()
            : txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    })
}

// fxn to initiate radio
function init(){
    fillGenreOptions()
}


$(document).ready(function() {

    init();
    $('#genre-select').change(function(){
        var selectedGenre = $(this).val();
        console.log(selectedGenre);

    });

});
