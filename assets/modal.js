const modal = $('#modal');
const closeButton = $('#closeButton');
const modalAPI = $('#modalAPI');
// const timerElement = $('#timer');
let currentTaskIndex = 0;
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

let timerInterval;
let timerCount = 0;
let minutes = 1;
let seconds = 0;
let timer;

const modalTimerText = '5:00';
const pomTimerText = '25:00'

const modalTimer = 5;
const pomTimer = 25;


const $pomTimerElement = $('#timer-section h2');
const $modalTimerElement = $('#modal-timer');



function countDownTimer(minutes, fxnDone, fxnDuring){
  let countDown = (minutes * 60);
  
  timer = setInterval(function(){
    if(countDown <= 0){
      clearInterval(timer);
      $("#start").css("pointer-events", "auto"); 
      fxnDone();
      // displayModal()
      // startModalTimer()
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

function stopTimer() {
  clearInterval(timer);
  $("#start").css("pointer-events", "auto"); 
}



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
  // console.log($localStorageContainer)

  let placeholderIndex = -1;

  $localStorageContainer.text('');
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  if(tasks){
    console.log('still happens')
    tasks.forEach((task, index) => {
      $localStorageContainer.append(`<span class="flex flex-row items-center justify-between">
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
          $('.add-task p').text(`${taskIndex}.`);
          $(this).parent('span').fadeOut('slow');
          

          setTimeout(function() {
            deleteTask(taskIndex);

        }, 1000); 




         })
  } else {
    $('.add-task p').text('1.');


  }
  $('#taskInput').attr('placeholder', 'Task');


}



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
  console.log(index);
  tasks.splice(index, 1);
  console.log(tasks);

  localStorage.setItem('tasks', JSON.stringify(tasks));
  console.log('')
  displayTasks();

}

// Fxn to switch to next task

function switchToNextTask() {
  // Retrieve tasks from localStorage
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  console.log(tasks);

  // Remove the completed task (if any)
  tasks.shift();
  // console.log(tasks);

  // Display the next task above the timer
  const nextTask = tasks[0] || 'Pomodoro Wellness';
  $('#taskDisplay').text(nextTask);

 // Save the updated list to localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
// fxn to delete task from queue



$(document).ready(function() {
  $pomTimerElement.text(pomTimerText);
  displayTasks();
  console.log(  $pomTimerElement);
  console.log(  $modalTimerElement)
  // take items from local storage and populate local storage container

  closeButton.on('click', closeModal);
  // Start the timer when the start button is clicked
  $('#start').on('click', function() {
    // console.log('clicked');
    // startTimer(.1);
    $("#start").css("pointer-events", "none"); 
    countDownTimer(pomTimer, displayModal, (timerCount) => updateTimerElement(timerCount, $pomTimerElement) )
  });

  // Stop the timer when the stop button is clicked
  $('#stop').on('click', function() {
    stopTimer();
  });
  $('#addTaskButton').on('click', addTask);

});

// $(document).ready(function() {
//   function displayUserTasks() {
//     // Retrieve the list of tasks from localStorage
//     const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
//     // Display the most recent task above the timer and under the input box
//     const mostRecentTask = tasks[0] || 'Pomodoro Wellness';
//     $('#taskDisplay').text(mostRecentTask);
  
//     // Clear the localStorageData container
//     $('#localStorageData').empty();
  
//     // Update the localStorageData container with all tasks
//     tasks.forEach((task, index) => {
//       const dataElement = $('<p>').text(`Task ${index + 1}: ${task}`);
//       $('#localStorageData').append(dataElement);
//     });
//   }
  
//   // Call displayUserTasks on page load
//   $(document).ready(function() {
//     // ... (other code)
  
//     // Call displayUserTasks on page load
//     displayUserTasks();
//   });
// });