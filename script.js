const userName = prompt("Enter your name");
const chat = document.querySelector(".chat-container");
const nameObject = { name: userName };

// Log in the room
function logIn() {
  const promisse = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    nameObject
  );
  promisse.then(checkName);
}

// Verify if the name the user select is already in use if so, runs logIn function again
function checkName(resposta) {
  if (resposta.status == 400) {
    alert("This Name is already in use, please use another one!");
    logIn();
  } else {
    return resposta;
  }
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

// Get messages of the room
function getMessages() {
  const data = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  data.then((response) => {
    response = response.data;
    for (i = 0; i < response.length; i++) {
      // Checks if the status of the message and appends to the chat container
      if (response[i].type == "status") {
        chat.innerHTML += `
                <div class="in-out-room-message">
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
                <div class="normal-message">
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
                    <div class="private-message">
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
  });
}

// Functions Running
logIn();
getMessages();
mantainConnection();
