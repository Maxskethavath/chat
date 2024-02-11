var user = {
    name: "",
    online: false
};

function startChat() {
    var userNameInput = document.getElementById("opponent-name-input");
    var userName = userNameInput.value.trim();

    if (userName !== "") {
        user.name = userName;
        user.online = true;

        document.getElementById("display-name").textContent = user.name;
        document.getElementById("online-status").textContent = user.online ? "Online" : "Offline";

        updateLastSeen();
        displayStoredMessages();

        document.getElementById("user-input").classList.add("hide");
        document.getElementById("chat-container").classList.remove("hide");
    }
}

function updateLastSeen() {
    var now = new Date();
    var formattedTime = now.toLocaleTimeString();
    document.getElementById("last-seen").textContent = "Last seen: " + formattedTime;
}

function displayStoredMessages() {
    var storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    var messagesContainer = document.getElementById("messages");

    storedMessages.forEach(function (message) {
        var li = createMessageElement(message);
        messagesContainer.appendChild(li);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    var messageInput = document.getElementById("message-input");
    var photoInput = document.getElementById("photo-input");

    var message = messageInput.value;
    var photo = photoInput.files[0];

    if (message.trim() !== "" || photo) {
        var messagesContainer = document.getElementById("messages");
        var li = createMessageElement({
            sender: user.name,
            content: message,
            photo: photo,
            timestamp: new Date().toLocaleTimeString()
        });

        messagesContainer.appendChild(li);

        saveMessagesToLocalStorage();

        messageInput.value = "";
        photoInput.value = "";

        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        updateLastSeen();
    }
}

function saveMessagesToLocalStorage() {
    var messages = [];
    var messagesElements = document.querySelectorAll('.message-item');

    messagesElements.forEach(function (element) {
        var sender = element.querySelector('.message-sender').textContent;
        var content = element.querySelector('.message-content').textContent;
        var timestamp = element.querySelector('.message-timestamp').textContent;

        var message = {
            sender: sender.substring(0, sender.length - 2),
            content: content,
            timestamp: timestamp
        };

        messages.push(message);
    });

    localStorage.setItem("chatMessages", JSON.stringify(messages));
}

function createMessageElement(message) {
    var li = document.createElement("li");
    li.classList.add("message-item");

    var isSentMessage = message.sender === user.name;
    li.classList.add(isSentMessage ? "sent-message" : "received-message");

    var senderName = document.createElement("span");
    senderName.classList.add("message-sender");
    senderName.textContent = message.sender + ": ";

    var contentContainer = document.createElement("span");
    contentContainer.classList.add("message-content");
    contentContainer.textContent = message.content;

    li.appendChild(senderName);
    li.appendChild(contentContainer);

    if (message.photo) {
        var imgContainer = document.createElement("div");

        var img = document.createElement("img");
        img.src = URL.createObjectURL(message.photo);
        img.alt = "Shared Photo";
        img.style.maxWidth = "200px";

        var downloadLink = document.createElement("a");
        downloadLink.href = img.src;
        downloadLink.download = "Shared_Photo.jpg";
        downloadLink.classList.add("download-link");

        var downloadIcon = document.createElement("span");
        downloadIcon.classList.add("download-icon");
        downloadIcon.textContent = "⬇";

        downloadLink.appendChild(downloadIcon);
        downloadLink.appendChild(document.createTextNode("Download"));

        imgContainer.appendChild(img);
        imgContainer.appendChild(downloadLink);
        li.appendChild(imgContainer);
    }

    var timestampContainer = document.createElement("span");
    timestampContainer.classList.add("message-timestamp");
    timestampContainer.textContent = message.timestamp;

    li.appendChild(timestampContainer);

    return li;
}

function clearChat() {
    var messagesContainer = document.getElementById("messages");
    messagesContainer.innerHTML = "";
    localStorage.removeItem("chatMessages");
    updateLastSeen();
}

document.getElementById("clear-chat-button").addEventListener("click", clearChat);
