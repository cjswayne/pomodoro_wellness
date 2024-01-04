$(document).ready(function() {
  const modal = $('#modal');
  const closeButton = $('#closeButton');
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

  function displayModal() {
    modal.show();
  }

  function closeModal() {
    modal.hide();
  }

  closeButton.on('click', closeModal);

  $.ajax(settings).done(function(response) {
    const exercises = response;
    const randomIndex = Math.floor(Math.random() * exercises.length);
    const randomExercise = exercises[randomIndex];
    const instructions = randomExercise.instructions;
    modalAPI.text(instructions);
    displayModal();
  });
});