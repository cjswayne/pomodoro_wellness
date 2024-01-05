$(document).ready(function () {
  const modal = $('#modal');
  const closeButton = $('#closeButton');
  const modalAPI = $('#modalAPI');
  const timer = $('#timer');
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
  const timerElement = $('#timer-section h2');

  function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function updateTimer() {
    seconds--;

    if (seconds < 0) {
      minutes--;
      seconds = 59;
    }

    if (minutes === 0 && seconds === 0) {
      stopTimer();
      timerCount++;

      if (timerCount % 4 === 0) {
        minutes = 25; // Reset to 25 minutes
      } else {
        minutes = 5; // Reset to 5 minutes
      }

      // Display the modal when the 25-minute timer ends
      if (timerCount % 4 === 1) {
        displayModal();
        startModalTimer();
      }

      startTimer();
    }

    timerElement.text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }

  function displayModal() {
    modal.show();
  }

  function closeModal() {
    modal.hide();
  }

  function startModalTimer() {
    let timeLeft = 5 * 60; // 5 minutes in seconds

    const modalTimerInterval = setInterval(function () {
      const modalMinutes = Math.floor(timeLeft / 60);
      const modalSeconds = timeLeft % 60;

      timer.text(`${modalMinutes}:${modalSeconds.toString().padStart(2, '0')}`); // small timer that appears in the top right of the modal

      if (timeLeft === 0) {
        clearInterval(modalTimerInterval);
        closeModal();
        minutes = 25; // Start a new 25-minute timer
        seconds = 0;
        startTimer();
      } else {
        timeLeft--;
      }
    }, 1000); // Update every second
  }

  closeButton.on('click', closeModal);

  // Start the timer when the start button is clicked
  $('#start').on('click', function () {
    startTimer();
  });

  // Stop the timer when the stop button is clicked
  $('#stop').on('click', function () {
    stopTimer();
  });

  $.ajax(settings).done(function (response) {
    const exercises = response;
    const randomIndex = Math.floor(Math.random() * exercises.length);
    const randomExercise = exercises[randomIndex];
    const instructions = randomExercise.instructions;
    modalAPI.text(instructions);
  });
});

$('#addTaskButton').on('click', addTask);

function addTask() {
  // Retrieve the value from the input element
  const task = document.getElementById('taskInput').value;

  // Retrieve the existing tasks from local storage
  let tasks = localStorage.getItem('tasks');

  // Check if there are existing tasks
  if (tasks) {
    // Parse the existing tasks from a string to an array
    tasks = JSON.parse(tasks);
  } else {
    // If there are no existing tasks, initialize an empty array
    tasks = [];
  }

  // Add the new task to the array
  tasks.push(task);

  // Save the updated tasks array to local storage
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Retrieve the tasks from local storage
  const savedTasks = JSON.parse(localStorage.getItem('tasks'));

  // Display the tasks above the timer and under the input box
  document.getElementById('taskDisplay').textContent = savedTasks.join(', ');

  // Clear the input field
  document.getElementById('taskInput').value = '';

  // Display the tasks stored in local storage
  const localStorageContainer = document.getElementById('localStorageData');
  localStorageContainer.innerHTML = '';

  savedTasks.forEach((task, index) => {
    const dataElement = document.createElement('p');
    dataElement.textContent = `Task ${index + 1}: ${task}`;
    localStorageContainer.appendChild(dataElement);
  });
}