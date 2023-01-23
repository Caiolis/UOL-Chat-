// Global Variables
const userName = prompt("Enter your name");

// Log in the room
function logIn() {
  const promisse = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    nameObject
  );
}

// Functions Running
logIn();
