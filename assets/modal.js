$(document).ready(function () {
  // Get a reference to the close button element
  const closeButton = $("#closeButton");

  // Get a reference to the modal element
  const modal = $("#modal");

  // Function to close the modal
  function closeModal() {
    modal.hide();
  }

  // Add click event listener to the close button
  closeButton.on("click", closeModal);

  // Set a timeout to show the modal after 25 minutes
  setTimeout(showModal, 25 * 60 * 1000); // 25 minutes in milliseconds

  // Function to show the modal
  function showModal() {
    modal.show();
  }

  // Add click event listener to the close button inside the modal
  closeButton.on("click", function () {
    modal.hide();
  });
});
