const SUBSCRIBE_API = "YOUR_SUBSCRIBE_API_GATEWAY_URL";
const PUBLISH_API = "YOUR_SEND_NOTIFICATION_API_GATEWAY_URL";

async function subscribeUser() {
    const emailInput = document.getElementById("emailInput");
    const btn = document.getElementById("subBtn");
    const email = emailInput.value.trim();

    if (!email || !email.includes("@")) {
        showBanner("Please enter a valid email address.", "error");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Subscribing...";

    if (SUBSCRIBE_API.startsWith("YOUR_")) {
        setTimeout(() => {
            showBanner("Test Mode: Subscription request logged for " + email, "success");
            addLog("SUBSCRIBE", email, "Ready (No API)");
            emailInput.value = "";
            btn.disabled = false;
            btn.innerText = "Subscribe";
        }, 400);
        return;
    }

    try {
        const response = await fetch(SUBSCRIBE_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        });

        if (response.ok) {
            showBanner("Confirmation email sent to " + email, "success");
            addLog("SUBSCRIBE", email, "200 OK");
            emailInput.value = "";
        } else {
            showBanner("Subscription failed. Status: " + response.status, "error");
            addLog("SUBSCRIBE", email, "Error " + response.status);
        }
    } catch (err) {
        showBanner("Failed to connect to API Gateway.", "error");
        addLog("SUBSCRIBE", email, "Network Error");
    } finally {
        btn.disabled = false;
        btn.innerText = "Subscribe";
    }
}

async function publishMessage() {
    const subjectInput = document.getElementById("subjectInput");
    const messageInput = document.getElementById("messageInput");
    const btn = document.getElementById("pubBtn");

    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!subject || !message) {
        showBanner("Subject and message fields cannot be empty.", "error");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Sending...";

    if (PUBLISH_API.startsWith("YOUR_")) {
        setTimeout(() => {
            showBanner("Test Mode: Message '" + subject + "' validated.", "success");
            addLog("PUBLISH", subject, "Ready (No API)");
            subjectInput.value = "";
            messageInput.value = "";
            btn.disabled = false;
            btn.innerText = "Send Notification";
        }, 500);
        return;
    }

    try {
        const response = await fetch(PUBLISH_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject: subject, message: message })
        });

        if (response.ok) {
            showBanner("Notification published successfully.", "success");
            addLog("PUBLISH", subject, "200 OK");
            subjectInput.value = "";
            messageInput.value = "";
        } else {
            showBanner("Publish failed. Status: " + response.status, "error");
            addLog("PUBLISH", subject, "Error " + response.status);
        }
    } catch (err) {
        showBanner("Failed to connect to API Gateway.", "error");
        addLog("PUBLISH", subject, "Network Error");
    } finally {
        btn.disabled = false;
        btn.innerText = "Send Notification";
    }
}

function showBanner(text, type) {
    const banner = document.getElementById("msgBanner");
    banner.innerText = text;
    banner.className = "banner " + type;
}

function addLog(type, payload, result) {
    const tbody = document.getElementById("logBody");
    const emptyRow = document.getElementById("noDataRow");
    if (emptyRow) {
        emptyRow.remove();
    }

    const time = new Date().toLocaleTimeString();
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${time}</td>
        <td>${type}</td>
        <td>${payload}</td>
        <td>${result}</td>
    `;
    tbody.prepend(row);
}

function clearLogs() {
    const tbody = document.getElementById("logBody");
    tbody.innerHTML = '<tr id="noDataRow"><td colspan="4" class="empty-text">No requests sent yet.</td></tr>';
}
