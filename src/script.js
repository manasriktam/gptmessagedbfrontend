document.addEventListener("DOMContentLoaded", function () {
  const dataDisplay = document.getElementById("dataDisplay");

  // Function to fetch and display data
  function fetchData() {
    dataDisplay.innerHTML = "Loading data...";

    // Make an AJAX request to fetch data
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "getData.php", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          displayData(data);
        } else {
          dataDisplay.innerHTML = "Error fetching data.";
        }
      }
    };
    xhr.send();
  }

  /// Function to display data
  function displayData(data) {
    if (data.length === 0) {
      dataDisplay.innerHTML = "No data available.";
      return;
    }

    let displayHTML = "<h2>Saved Data</h2>";
    displayHTML += "<ul>";
    data.forEach((item) => {
      displayHTML += `<li><strong>Name:</strong> ${item.name}, <strong>Email:</strong> ${item.email}`;
      displayHTML += ` <button class="deleteBtn" data-id="${item.id}">Delete</button></li>`;
    });
    displayHTML += "</ul>";

    dataDisplay.innerHTML = displayHTML;

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll(".deleteBtn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const recordId = button.getAttribute("data-id");
        deleteRecord(recordId);
      });
    });
  }

  // Fetch data when the page loads
  fetchData();

  // Function to delete a record
  function deleteRecord(recordId) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "delData.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          fetchData(); // Refresh data after deletion
        } else {
          console.error("Error deleting record.");
        }
      }
    };
    xhr.send(`id=${recordId}`);
  }
});
