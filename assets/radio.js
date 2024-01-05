/*
Select genre (have list of preselected genres)
toggle for turning radio on and off
volume?
shuffle button
next station/previous station
*/

// STOPPING POINT: Continue to debug radio, then add more fxnality

var audio = new Audio();
var stationNumber;
var radioPlaying = false;
var genres = [
    "music for study",
    "jazz", 
    "lofi",
    "hip hop",
    "classical",
    "relax",
    "focus radio"
    ]
// var tag = 'jazz';

// // Make a GET request to the Radio Browser API

// fxn to return radio station
// function getStation(type, tag, location, )

// fxn to start/stop radio


// fxn to populate genre options
function fillGenreOptions(){


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

// fxn to start and stop radio from playing 
function toggleAudio(){
    if(!audio.paused){
        console.log('paused');
        audio.pause();
        // audio.currentTime = 0;
    } else {
        console.log('unpaused');
        audio.play();
    }

}

// fxn get stations by tag 
function getStationDataByTag(tag){
    $.ajax({
        url: 'https://de1.api.radio-browser.info/json/stations/bytag/' + tag,
        method: 'GET',
        success: function(data) {
            
            stationNumber = 0;
            // let station = data[stationNumber]

            playStation(data);

            $('#previous').click(function(){
                previousStation(data);
            })
            $('#next').click(function(){
                nextStation(data);
            })
            $('#shuffle').click(function(){
                stationNumber = randomNumber(data.length);
                playStation(data);
            })
        },
        error: function(error) {
            console.error('Error fetching stations:', error);
            
        }
    });
}

// fxn to pick random station and genre
function pickRandom(){
    let randomGenre = genres[randomNumber(genres.length)];
    getStationDataByTag(randomGenre);
    console.log('shuffle ' + randomGenre);
}


// fxn to go to next station
function nextStation(stations){

    stationNumber++;
    console.log(stationNumber);
    playStation(stations);
}

// fxn to go to previous station
function previousStation(stations){
    stationNumber--;
    console.log(stationNumber);

    playStation(stations);
}

// fxn to play station
function playStation(stations){
    console.log(stations);
    let station = stations[stationNumber];
    console.log(station);
    // console.log(station);
    // toggleAudio()

    if(station){
        if(radioPlaying){
            audio.onpause = function() {
                audio.onpause = null;

                playNewStation(station, stations);

                radioPlaying = false;
                console.log('new station playing now');
                
            };

            audio.pause();
            audio.currentTime = 0;
        } else {
            playNewStation(station, stations);
        }

    }

}

// fxn to play new station 
function playNewStation(station, stations) {
    audio.src = station.url;
    audio.play().then(() =>{
        radioPlaying = true;
    }).catch(e => {
        console.error('Error playing the audio:', e);
        radioPlaying = false;
        stationNumber++;
        playStation(stations);
    });
}

// fxn to play random station 

$(document).ready(function() {

    init();
    stationNumber = 0;
    $('#genre-select').change(function(){
        var tag = $(this).val();
        console.log(tag);
        getStationDataByTag(tag)


    });
    console.log($('#toggle-collapse'));
    $('#toggle-collapse').click(function(){
        toggleElClass('dn', '#genre-select');
    });
    $('#radio-toggle').click(function(){
        toggleAudio();
    });
    $('#shuffle').click(function(){
        pickRandom();
    })


});
