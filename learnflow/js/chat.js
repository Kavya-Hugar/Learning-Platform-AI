// ===== AI ASSISTANT CHAT =====

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

  // Simulate AI response delay
  setTimeout(() => {
    // Remove typing indicator
    document.getElementById('typingIndicator')?.remove();
    
    // Generate AI response
    const aiResponse = generateAIResponse(msg);
    
    // Add AI response
    const aiMsg = document.createElement('div');
    aiMsg.className = 'ai-msg ai-msg-ai';
    aiMsg.innerHTML = `<div class="ai-msg-content">${aiResponse}</div>`;
    messages.appendChild(aiMsg);
    messages.scrollTop = messages.scrollHeight;
  }, 800);
}

function generateAIResponse(query) {
  const q = query.toLowerCase();
  
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return "Hello! 👋 I'm your AI learning assistant. How can I help you today?";
  } else if (q.includes('course') || q.includes('learn')) {
    return "I can help you find the right course! We have courses in Programming, Design, Data Science, Business, and DevOps. What topic interests you most?";
  } else if (q.includes('price') || q.includes('cost') || q.includes('free')) {
    return "All our courses are completely free to enroll! You get lifetime access, progress tracking, and a certificate upon completion.";
  } else if (q.includes('certificate')) {
    return "Yes! You receive a certificate when you complete a course. Just finish all the video lessons and your certificate will be available.";
  } else if (q.includes('progress') || q.includes('track')) {
    return "Your progress is automatically saved as you watch videos. You can see your overall progress in your profile under 'My Learning'.";
  } else if (q.includes('help') || q.includes('how')) {
    return "I'm here to help! You can ask me about courses, pricing, certificates, progress tracking, or any other questions about LearnFlow.";
  } else if (q.includes('programming') || q.includes('code') || q.includes('javascript') || q.includes('react')) {
    return "We have great programming courses! Check out our Programming category for courses on JavaScript, React, Python, and more.";
  } else if (q.includes('design')) {
    return "Our Design courses cover UI/UX, graphic design, and Figma. Perfect for creative learners!";
  } else if (q.includes('data') || q.includes('science') || q.includes('python')) {
    return "Data Science is one of our popular categories! Learn Python for data analysis, machine learning basics, and data visualization.";
  } else if (q.includes('devops') || q.includes('docker') || q.includes('kubernetes')) {
    return "Our DevOps courses cover Docker, Kubernetes, CI/CD pipelines, and cloud deployment. Great for infrastructure engineers!";
  } else if (q.includes('business') || q.includes('product')) {
    return "Our Business courses include Product Management, agile methodologies, and business strategy. Perfect for aspiring PMs!";
  } else if (q.includes('thank')) {
    return "You're welcome! 😊 Let me know if you have any other questions.";
  } else if (q.includes('bye') || q.includes('goodbye')) {
    return "Goodbye! Happy learning! 🎓";
  } else {
    return "That's a great question! I'm your AI learning assistant. I can help you find courses, understand features, or guide your learning journey. What would you like to know?";
  }
}
