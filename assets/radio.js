/*
Select genre (have list of preselected genres)
toggle for turning radio on and off
volume?
shuffle button
next station/previous station
*/

var audio = new Audio();

// var tag = 'jazz';

// // Make a GET request to the Radio Browser API

// fxn to return radio station
// function getStation(type, tag, location, )

// fxn to start/stop radio

// fxn select genre
function stationGenreSelect(genre){
    $.ajax({
        url: 'https://de1.api.radio-browser.info/json/stations/bytag/' + genre,
        method: 'GET',
        success: function(data) {
            console.log(data);
            let randomStation = data[randomNumber(data.length)]
            console.log(randomStation);
            if(!audio.paused){
                audio.pause();
                audio.currentTime = 0;
            }

            if(data.length > 0){
                let url = randomStation.url;
                audio.src = url;
                audio.play();
            }
        },
        error: function(error) {
            console.error('Error fetching stations:', error);
        }
    });
}
// fxn to populate genre options
function fillGenreOptions(){
    var genres = [
        "music for study",
        "jazz", 
        "lofi",
        "hip hop",
        "classical",
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

//fxn to give random number 0 - max
function randomNumber(max){
return Math.floor(Math.random()* (max + 1))
}

//fxn to take or add class of element
function toggleElClass(className, el){
    $(el).hasClass(className) ? $(el).removeClass(className) : $(el).addClass(className);
}

$(document).ready(function() {

    init();
    $('#genre-select').change(function(){
        var selectedGenre = $(this).val();
        stationGenreSelect(selectedGenre);
        console.log(selectedGenre);

    });
    console.log($('#toggle-collapse'));
    $('#toggle-collapse').click(function(){
        toggleElClass('dn', '#genre-select');
    })

});
