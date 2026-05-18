// ===== AI ASSISTANT CHAT =====

// Backend API URL - change this for production
// For local development: http://localhost:5000
// For production: https://your-render-app.onrender.com
const API_BASE_URL = 'http://localhost:5000';

function toggleAI() {
  const chat = document.getElementById('aiChat');
  const fab = document.getElementById('aiFab');
  chat.classList.toggle('open');
  fab.style.display = chat.classList.contains('open') ? 'none' : 'flex';
  if (chat.classList.contains('open')) {
    document.getElementById('aiInput').focus();
  }
}

async function sendAIMessage() {
  const input = document.getElementById('aiInput');
  const msg = input.value.trim();
  if (!msg) return;

  const messages = document.getElementById('aiMessages');
  
  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'ai-msg ai-msg-user';
  userMsg.innerHTML = `<div class="ai-msg-content">${msg}</div>`;
  messages.appendChild(userMsg);
  
  input.value = '';
  messages.scrollTop = messages.scrollHeight;

  // Show typing indicator
  const typingMsg = document.createElement('div');
  typingMsg.className = 'ai-msg ai-msg-ai';
  typingMsg.innerHTML = `<div class="ai-msg-content">...</div>`;
  typingMsg.id = 'typingIndicator';
  messages.appendChild(typingMsg);
  messages.scrollTop = messages.scrollHeight;

  try {
    // Call backend API
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: msg })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    
    // Remove typing indicator
    document.getElementById('typingIndicator')?.remove();
    
    // Add AI response
    const aiMsg = document.createElement('div');
    aiMsg.className = 'ai-msg ai-msg-ai';
    aiMsg.innerHTML = `<div class="ai-msg-content">${data.response}</div>`;
    messages.appendChild(aiMsg);
    messages.scrollTop = messages.scrollHeight;

  } catch (error) {
    console.error('Chat error:', error);
    
    // Remove typing indicator
    document.getElementById('typingIndicator')?.remove();
    
    // Show error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'ai-msg ai-msg-ai';
    errorMsg.innerHTML = `<div class="ai-msg-content">Sorry, I'm having trouble connecting. Please try again later.</div>`;
    messages.appendChild(errorMsg);
    messages.scrollTop = messages.scrollHeight;
  }
}
