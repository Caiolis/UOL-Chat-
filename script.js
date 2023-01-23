// Global Variables
const userName = prompt("Enter your name");
const chat = document.querySelector(".chat-container");
const typeField = document.getElementById("type-field");
const message = document.getElementsByClassName('message-container')
const nameObject = { name: userName };

// Log in the room
function logIn() {
  const promisse = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    nameObject
  );
  promisse.then(getMessages);
  promisse.catch(() => {
    alert("This Name is already in use, please use another one!");
    logIn();
  })
}

// Keep the user in the room, this function runs itself every 5 seconds
function mantainConnection() {
  const promisse = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    nameObject
  );
  promisse.then(() => {
    setInterval(mantainConnection(), 5000);
  });
}

// Get messages of the room and reloads it every 3 seconds
function getMessages() {
  const data = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  data.then((response) => {
    response = response.data;
    for (i = 0; i < response.length; i++) {
      // Checks if the status of the message and appends to the chat container
      if (response[i].type == "status") {
        chat.innerHTML += `
                <div class="in-out-room-message message-container" data-test="message">
                    <span class="message">
                        <span class="hour">
                            ${response[i].time}
                        </span>
                        <strong class="name">
                            ${response[i].from}
                        </strong>
                        ${response[i].text}
                    </span>
                </div>
            `;
      } else if (response[i].type == "message") {
        chat.innerHTML += `
                <div class="normal-message message-container" data-test="message">
                    <span class="message">
                        <span class="hour">
                        ${response[i].time}
                        </span>
                        <strong class="name">
                        ${response[i].from}
                        </strong>
                        para
                    <strong class="name">
                            ${response[i].to}
                        </strong>

                        ${response[i].text}
                    </span>
                </div>
                `;
      } else {
        chat.innerHTML += `
                    <div class="private-message message-container" data-test="message">
                        <span class="message">
                            <span class="hour">
                                ${response[i].time}
                            </span>
                            <strong class="name">
                                ${response[i].from}
                            </strong>
                        reservadamente para
                        <strong class="name">
                                ${response[i].to}
                            </strong>
                            ${response[i].text}
                        </span>
                    </div>
                `;
      }
    }
    message[99].scrollIntoView();
  });

}

// Updates the chat by running this function every 3 seconds 
function updateChat() {
  setInterval(() => {
    chat.innerHTML = ''
    getMessages()
    
  }, 3000)
}

// Get the message written by the user and sends to the server
function sendMessage() {
  const messageObject = {
    from: userName,
    to: 'Todos',
    text: typeField.value,
    type: 'message'
  };

  const promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageObject);
  promisse.then(response => {
    chat.innerHTML = ''
    typeField.value = ''
    getMessages()
  })
  promisse.catch(response => {
    typeField.value = ''
    window.location.reload()
  })
}

// Functions Running
logIn();
mantainConnection();
updateChat();
