var audio = new Audio();
var stationNumber;
var radioPlaying = false;
var retries = 0;
var maxRetries = 3;
var retryInterval = 100;
var stations;
var nextPreviousToggle;
var genres = [
    "classical",
    "focus radio",

    "lofi",
    "music for study",
    "jazz", 

    "hip hop",

    "relax"
    ]


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
        
        audio.pause();
        $('#radio-toggle').text('start');
    } else {
        let isGenreSelected = $('#genre-select').val() ? true : false;
        if(isGenreSelected){
            
            audio.play();
            
            $('#radio-toggle').text('stop');

            fillRadio();
        } else if(!radioPlaying) {
            audio.play();
            $('#radio-toggle').text('stop');
        } else {
            pickRandom()

        }
        $('#radio-toggle').text('stop');
    }

}

// fxn get stations by tag 
function getStationDataByTag(tag, random){
    $.ajax({
        url: 'https://de1.api.radio-browser.info/json/stations/bytag/' + tag,
        method: 'GET',
        success: function(data) {
            stations = data;

            if(random){
                stationNumber = randomNumber(stations.length);
                playStation();
            } else {
                playStation();
            }


            $('#previous').click(function(e){    
                disablePrevNext()
                previousStation();
            })
        
            $('#next').click(function(e){
                disablePrevNext()
                nextStation();

            })

        },
        error: function(error) {
            console.error('Error fetching stations:', error);
            
        }
    });
}

// fxn toggle previous and next btns
function disablePrevNext(){



        $('#previous').prop('disabled', true);
        $('#genre-select').prop('disabled', true);
        $('#next').prop('disabled', true);

    

}
// fxn toggle previous and next btns

function enablePrevNext(){
    $('#previous').prop('disabled', false);
    $('#next').prop('disabled', false);
    $('#genre-select').prop('disabled', false);
}

// fxn to pick random station and genre
function pickRandom(){
    if(radioPlaying){
        let randomGenre = genres[randomNumber(genres.length)];
        $('#genre-select').val(randomGenre);
        getStationDataByTag(randomGenre, true);
    
    }
}

// fxn to fill in radio data
function fillRadio(){
    let station = stations[stationNumber];
    if(station.name){
        $('#station-name').text(station.name);
        
    } 
    $('#station-number').text(stationNumber);
    enablePrevNext()

}

// fxn to go to next station
function nextStation(){
    disablePrevNext()
    nextPreviousToggle = true;
    stationNumber++;

    if(stationNumber > (stations.length - 1)){
        stationNumber = 0;
    } 
    $("#station-number").text(stationNumber);
    playStation();
}

// fxn to go to previous station
function previousStation(){
    disablePrevNext()
    nextPreviousToggle = false;
    stationNumber--;
    if(stationNumber < 0){
        stationNumber = (stations.length - 1);
    } 


    playStation();
}

// fxn to play station
function playStation(){
    

    let station = stations[stationNumber];


    if(station){
        if(radioPlaying){
            audio.onpause = function() {

                audio.onpause = null;
                radioPlaying = false;
                playNewStation();
                $('#radio-toggle').text('stop');
                enablePrevNext()
                
            };

            audio.pause();
            audio.currentTime = 0;
        } else {
            playNewStation();
        }

    }

}

// fxn to play new station 
function playNewStation() {
    let station = stations[stationNumber];

    audio.src = station.url;
    audio.load();


    tryAudio();


}

//fxn to start audio 
function startAudio(){
    $.ajax({
        url: 'https://de1.api.radio-browser.info/json/stations/bytag/' + genres[0],
        method: 'GET',
        success: function(data) {
            stations = data;

                stationNumber = randomNumber(stations.length);


            $('#previous').click(function(e){

                previousStation();
            })
            $('#next').click(function(e){

                nextStation();
            })
            let station = stations[stationNumber];

            audio.src = station.url;
            audio.load();

            $('#radio-toggle').prop('disabled', false);


        },
        error: function(error) {
            console.error('Error fetching stations:', error);
            
        }
    });
}

// fxn to attempt to play audio
function tryAudio(){
    audio.play().then(() =>{
        $('#radio-toggle').text('stop');

        radioPlaying = true;
        fillRadio();
    }).catch(e => {

        radioPlaying = false;
        handlePlayback();
    });
}

// fxn to handle playback error
function handlePlayback(){
    if(retries < maxRetries){
        console.log(`Retry ${retries + 1} of ${maxRetries}`);
        setTimeout(() => {
            retries++;
            playNewStation();
        }, retryInterval);
    } else {
        if(nextPreviousToggle){
            nextStation();
        } else {
            previousStation();
        }

    }
}

// fxn to remove station if it isnt active
function removeStation(stations, station){
    var removalIndex = stations.filter(item => item === station);

    if(removalIndex !== -1){
        stations.splice(indexToRemove, 1);
    }
}

// fxn to animate the station Name marquee
function animateStationName(){
    const stationName = $('#station-name');
    const marqueeContainerWidth = $('#marquee-container').width();
    const textWidth = stationName.width();
    const start = marqueeContainerWidth;
    const end = -textWidth;

    stationName.css({left:start});
    stationName.animate({left:end}, 8000, "linear", function() {

        setTimeout(animateStationName(), 50); 
    });
}


$(document).ready(function() {
    $('#station-name').text('loading');
    $('#radio-toggle').prop('disabled', true);
    disablePrevNext()

    startAudio()
    init();
    animateStationName();
    $('#genre-select').change(function(){
        disablePrevNext();
        stationNumber = 0;
        var tag = $(this).val();
        getStationDataByTag(tag)


    });
    
    $('#toggle-collapse').click(function(){
        toggleElClass('dn', '#genre-select');
    });
    $('#radio-toggle').click(function(){
        disablePrevNext()
        if($('#radio-toggle').text() == 'start'){
            $('#radio-toggle').text('stop');
        } else {
            $('#radio-toggle').text('stop');

        }
        toggleAudio();
    });
    $('#shuffle').click(function(){
        pickRandom();
    })


});
