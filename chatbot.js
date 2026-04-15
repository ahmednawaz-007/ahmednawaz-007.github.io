(function () {
  const WEBHOOK_URL = "https://albercamu.app.n8n.cloud/webhook/portfolio-chat";

  const style = document.createElement("style");
  style.textContent = `
    #ahmed-chat-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%;
      background: #F59E0B; color: #07090d; border: none;
      font-size: 22px; cursor: pointer;
      box-shadow: 0 4px 16px rgba(245,158,11,0.4);
      transition: transform 0.2s;
    }
    #ahmed-chat-btn:hover { transform: scale(1.08); }
    #ahmed-chat-box {
      position: fixed; bottom: 90px; right: 24px; z-index: 9999;
      width: 320px; background: #0d1117;
      border: 0.5px solid rgba(245,158,11,0.3);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      display: none; flex-direction: column;
      font-family: 'DM Sans', sans-serif; overflow: hidden;
    }
    #ahmed-chat-header {
      background: #111820;
      border-bottom: 0.5px solid rgba(245,158,11,0.2);
      padding: 14px 16px;
    }
    #ahmed-chat-header strong {
      display: block; color: #F59E0B;
      font-size: 14px; margin-bottom: 2px;
    }
    #ahmed-chat-header span {
      color: #7A8499; font-size: 12px;
    }
    #ahmed-chat-messages {
      overflow-y: auto; padding: 12px;
      max-height: 280px;
      display: flex; flex-direction: column; gap: 8px;
    }
    .ahmed-msg {
      padding: 9px 13px; border-radius: 10px;
      font-size: 13px; line-height: 1.5; max-width: 85%;
    }
    .ahmed-msg.bot {
      background: #111820;
      border: 0.5px solid rgba(255,255,255,0.07);
      color: #E8EAF0; align-self: flex-start;
    }
    .ahmed-msg.user {
      background: #F59E0B; color: #07090d;
      align-self: flex-end; font-weight: 500;
    }
    #ahmed-chat-input-row {
      display: flex; padding: 10px;
      border-top: 0.5px solid rgba(255,255,255,0.07);
      gap: 8px;
    }
    #ahmed-chat-input {
      flex: 1;
      background: #111820;
      border: 0.5px solid rgba(255,255,255,0.1);
      border-radius: 6px; color: #E8EAF0;
      padding: 8px 10px; font-size: 13px; outline: none;
    }
    #ahmed-chat-input::placeholder { color: #4A5568; }
    #ahmed-chat-send {
      background: #F59E0B; color: #07090d;
      border: none; border-radius: 6px;
      padding: 8px 14px; cursor: pointer;
      font-size: 13px; font-weight: 600;
    }
    #ahmed-chat-send:hover { opacity: 0.85; }
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML("beforeend", `
    <button id="ahmed-chat-btn" title="Chat with Ahmed's assistant">💬</button>
    <div id="ahmed-chat-box">
      <div id="ahmed-chat-header">
        <strong>Ahmed's AI Assistant</strong>
        <span>Ask about services, projects or hiring</span>
      </div>
      <div id="ahmed-chat-messages">
        <div class="ahmed-msg bot">Hi! I'm Ahmed's assistant. Ask me about his automation services, projects, or how to hire him 👋</div>
      </div>
      <div id="ahmed-chat-input-row">
        <input id="ahmed-chat-input" type="text" placeholder="Type a message..." />
        <button id="ahmed-chat-send">Send</button>
      </div>
    </div>
  `);

  const btn = document.getElementById("ahmed-chat-btn");
  const box = document.getElementById("ahmed-chat-box");
  const messages = document.getElementById("ahmed-chat-messages");
  const input = document.getElementById("ahmed-chat-input");
  const send = document.getElementById("ahmed-chat-send");

  btn.addEventListener("click", () => {
    box.style.display = box.style.display === "flex" ? "none" : "flex";
  });

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    messages.insertAdjacentHTML("beforeend", `<div class="ahmed-msg user">${text}</div>`);
    messages.insertAdjacentHTML("beforeend", `<div class="ahmed-msg bot" id="typing">Thinking...</div>`);
    messages.scrollTop = messages.scrollHeight;
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      document.getElementById("typing").textContent = data.reply;
    } catch (e) {
      document.getElementById("typing").textContent = "Sorry, something went wrong. Try again!";
    }
    messages.scrollTop = messages.scrollHeight;
  }

  send.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
})();
