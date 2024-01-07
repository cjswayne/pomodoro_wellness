const modalAPI = $('#modalAPI');
const settings = {
  async: true,
  crossDomain: true,
  url: 'https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises?type=stretching&difficulty=beginner',
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '2aade0df73msh092561d66cc6328p124b29jsn58062a61a115',
    'X-RapidAPI-Host': 'exercises-by-api-ninjas.p.rapidapi.com'
  }
};

let timerCount = 0;
let minutes = 1;
let seconds = 0;
let timer;

const closeButton = $('#closeButton');

const modal = $('#modal');
const $modalTimerElement = $('#modal-timer');
const modalTimerText = '00:02';
const modalTimer = convertTimeToMinutes(modalTimerText);

const $pomTimerElement = $('#timer-section h2');
const pomTimerText = '00:02'
let pomTimer = convertTimeToMinutes(pomTimerText);


// fxn to start a countdown with interval in minutes, a fxn to run when the interval is done, and a fxn to run during the interval
function countDownTimer(minutes, fxnDone, fxnDuring){
  let countDown = (minutes * 60);
  timer = setInterval(function(){
    if(countDown <= 0){
      // $("#timer-section > div > h2").addClass('flashing-text');
      clearInterval(timer);
      $("#start").css("pointer-events", "auto"); 
      fxnDone();
    } else {
      fxnDuring(countDown);
    }
    countDown--;
  }, 1000)
}

// fxn to update timer element 
function updateTimerElement(timerCount, timerElementText) {
  let modalMinutes = Math.floor(timerCount / 60);
  let modalSeconds = timerCount % 60;

  timerElementText.text(`${modalMinutes}:${((modalSeconds < 10) ? ('0' + modalSeconds ): modalSeconds)}`);
}

//fxn to stop the timer
function stopTimer() {
  pomTimer = convertTimeToMinutes($pomTimerElement.text());

  clearInterval(timer);
  $("#start").css("pointer-events", "auto"); 
}

//fxn to convert time to minutes
function convertTimeToMinutes(timeStr){
  const parts = timeStr.split(':');
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);

  return minutes + (seconds - 1) / 60;
}

// fxn to display modal
function displayModal() {
  $pomTimerElement.text(pomTimerText);
  $modalTimerElement.text(modalTimerText);
  countDownTimer(modalTimer, closeModal, (timerCount) => updateTimerElement(timerCount, $modalTimerElement) )

  $.ajax(settings).done(function(response) {
    const exercises = response;
    const randomIndex = Math.floor(Math.random() * exercises.length);
    const randomExercise = exercises[randomIndex];
    const instructions = randomExercise.instructions;
    modalAPI.text(instructions);
  });
  modal.show();
}

function closeModal() {
  switchToNextTask()
  modal.hide();
}

//fxn to display tasks
function displayTasks(){
  const $localStorageContainer = $('#localStorageData');
  $localStorageContainer.text('');

  let placeholderIndex = -1;
  let tasksLength;
  // $localStorageContainer.text('');
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  if(tasks){

    tasksLength = tasks.length;
    
    tasks.forEach((task, index) => {
      $localStorageContainer.append(`
      <span class="flex flex-row items-center justify-between">
        <p>${index + 1}. ${task}</p>
        <button id="task-item-${index}" class="del-task bubble wipe-btn">
          <i class="fa fa-times"></i>
        </button>
      </span>`);
        placeholderIndex = index;
        });

        $('.add-task p').text(`${placeholderIndex + 2}.`);

        $('button.del-task').on('click', function(event){
          let taskIndex = event.currentTarget.id
          taskIndex = taskIndex.replace('task-item-', '')
          $('.add-task p').text(`${tasksLength}.`);

          updateQueueOrder('#localStorageData span > p', taskIndex, tasksLength);
          $(this).parent('span').fadeOut('slow');
          deleteTask(taskIndex);

          setTimeout(function() {
            displayTasks();
          }, 1000); 
         })
  } else {
    $('.add-task p').text('1.');
  }
  $('#taskInput').attr('placeholder', 'Task');
}

// fxn to update queue order
function updateQueueOrder(selector, listIndex, length){
  $(selector).each(function(index){
    var buttonId = $(this).siblings('button').attr('id');
    buttonId = buttonId.replace('task-item-', '')
    var buttonIdNumber = parseInt(buttonId, 10);
    console.log(buttonIdNumber);
    if(listIndex < buttonIdNumber){
      $(this).text(`${buttonIdNumber++}.`);
    }
  })
}

// fxn to add task
function addTask() {
  // Retrieve the value from the input element
  const task = document.getElementById('taskInput').value;

  // Retrieve the existing tasks from localStorage or initialize an empty array
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Add the new task to the list
  savedTasks.push(task);

  // Save the updated list to localStorage
  localStorage.setItem('tasks', JSON.stringify(savedTasks));

  // Clear the input field
  document.getElementById('taskInput').value = '';

  // Retrieve the list of tasks from localStorage
  const tasks = JSON.parse(localStorage.getItem('tasks'));

  // Display the most recent task above the timer and under the input box
  const firstTask = tasks[0];
  document.getElementById('taskDisplay').textContent = firstTask;

  displayTasks();
}


// fxn to delete task
function deleteTask(index){
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// fxn to switch to next task
function switchToNextTask() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  console.log(tasks);

  tasks.shift();

  const nextTask = tasks[0] || 'Pomodoro Wellness';
  $('#taskDisplay').text(nextTask);

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

$(document).ready(function() {

  $pomTimerElement.text(pomTimerText);
  
  displayTasks();

  closeButton.on('click', closeModal);

  // Start the timer when the start button is clicked
  $('#start').on('click', function() {
    $("#start").css("pointer-events", "none"); 
    countDownTimer(pomTimer, displayModal, (timerCount) => updateTimerElement(timerCount, $pomTimerElement))
  });

  // Stop the timer when the stop button is clicked
  $('#stop').on('click', function() {
    stopTimer();
    // $("#timer-section > div > h2").removeClass('flashing-text');
  });

  $('#addTaskButton').on('click', addTask);

  // $('body').on('click', function(){
  //   $("#timer-section > div > h2").removeClass('flashing-text');
  // })
});