// Get a reference to the close button element
const closeButton = document.getElementById("closeButton");

// Get a reference to the modal element
const modal = document.getElementById("modal");

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
}

// Add click event listener to the close button
closeButton.addEventListener("click", closeModal);