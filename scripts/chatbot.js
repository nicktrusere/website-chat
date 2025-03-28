document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chatbot-window');
    const sendBtn = document.getElementById('chatbot-send');
    const clearBtn = document.getElementById('clear-chat');
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');

    let formData = {};
    let formStep = 0;
    let chatHistory = [];
    const MAX_MESSAGES = 30; // Adjusted FIFO limit
    const userId = 'user123'; // Replace with a dynamic user ID (e.g., from session or login)

    // Load chat history from the backend
    async function loadChatHistory() {
        try {
            const response = await fetch(`http://localhost:3001/api/chat-history/${userId}`);
            if (response.ok) {
                chatHistory = await response.json();
                renderChatHistory();
            } else {
                console.error('Failed to load chat history');
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    // Save chat history to the backend
    async function saveChatHistory() {
        try {
            await fetch(`http://localhost:3001/api/chat-history/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chatHistory)
            });
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    // Clear chat history on the backend
    async function clearChatHistory() {
        try {
            await fetch(`http://localhost:3000/api/chat-history/${userId}`, {
                method: 'DELETE'
            });
            chatHistory = [];
            renderChatHistory();
            addMessage('bot', 'Chat cleared! How can I assist you now?');
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    }

    // Render chat history in the chat window
    function renderChatHistory() {
        messages.innerHTML = ''; // Clear current messages
        chatHistory.forEach(msg => {
            const msgDiv = document.createElement('div');
            if (msg.type === 'link') {
                msgDiv.innerHTML = `Bot: ${msg.text} <a href="${msg.url}" target="_blank">Click here</a>`;
            } else {
                msgDiv.textContent = `${msg.sender === 'user' ? 'You' : 'Bot'}: ${msg.text}`;
            }
            messages.appendChild(msgDiv);
        });
        messages.scrollTop = messages.scrollHeight;
    }

    // Add a message to the chat history with FIFO
    function addMessage(sender, text, type = 'text', url = '') {
        const messageObj = { sender, text, type };
        if (type === 'link') messageObj.url = url;

        chatHistory.push(messageObj);

        // Implement FIFO: Remove oldest messages if limit exceeded
        if (chatHistory.length > MAX_MESSAGES) {
            chatHistory.shift(); // Remove the oldest message
        }

        saveChatHistory();
        renderChatHistory();
    }

    // Add a link message
    function addLinkMessage(text, url) {
        addMessage('bot', text, 'link', url);
    }

    // Toggle chatbot window
    toggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            if (chatHistory.length === 0) {
                addMessage('bot', 'Hello! Welcome to ND Electrical Training Centre. How can I assist you today?');
            } else {
                renderChatHistory();
            }
        }
    });

    // Load chat history on page load
    loadChatHistory();

    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);

    // Send message on Enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Clear chat history on button click
    clearBtn.addEventListener('click', clearChatHistory);

    function sendMessage() {
        const userMessage = input.value.trim();
        if (userMessage) {
            addMessage('user', userMessage);
            processMessage(userMessage);
            input.value = '';
        }
    }

    function processMessage(message) {
        message = message.toLowerCase();

        // Form collection logic
        if (formStep > 0) {
            handleFormCollection(message);
            return;
        }

        // Predefined responses
        if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
            addMessage('bot', 'You can reach us at: info@ndelectrical.co.za or 123-456-7890');
            addLinkMessage('Visit our contact page for more details:', 'https://www.ndelectrical.co.za/contact');
        } else if (message.includes('services') || message.includes('what do you offer') || message.includes('training')) {
            addMessage('bot', 'We offer electrical training courses, certifications, and practical workshops. Want to know more?');
            addLinkMessage('Explore our programs:', 'https://www.ndelectrical.co.za/courses');
        } else if (message.includes('installation') || message.includes('electrical')) {
            addMessage('bot', 'Let me get you some detailed info on electrical installations...');
            getAIResponse(message); // Placeholder for AI integration
        } else if (message.includes('more info') || message.includes('details')) {
            addLinkMessage('Check out our full offerings on the website!', 'https://www.ndelectrical.co.za/');
        } else if (message.includes('form') || message.includes('contact us') || message.includes('enroll')) {
            formStep = 1;
            addMessage('bot', 'May I have your name, please?');
        } else if (message.includes('emergency')) {
            addLinkMessage('For emergencies, please call 123-456-7890 or visit our site:', 'https://www.ndelectrical.co.za/emergency');
        } else {
            addMessage('bot', 'I’m not sure how to help with that. Try asking about our training programs, contact info, or enrollment!');
        }
    }

    function handleFormCollection(message) {
        if (formStep === 1) {
            formData.name = message;
            addMessage('bot', 'Great! What’s your email address?');
            formStep = 2;
        } else if (formStep === 2) {
            formData.email = message;
            addMessage('bot', 'Thanks! What’s your inquiry or course interest?');
            formStep = 3;
        } else if (formStep === 3) {
            formData.inquiry = message;
            addMessage('bot', 'Got it! We’ll get back to you soon.');
            console.log('Form Data Collected:', formData); // Replace with backend save
            formStep = 0;
            formData = {};
        }
    }

    // Placeholder for AI integration
    function getAIResponse(message) {
        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            addMessage('bot', 'Electrical installations involve wiring, circuit setup, and safety checks. We also offer training on this! Interested in a course?');
            addLinkMessage('Learn more about our installation courses:', 'https://www.ndelectrical.co.za/courses');
        }, 1000);
        // Example real API call:
        
        fetch('https://localhost:3000', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => addMessage('bot', data.reply))
        .catch(error => addMessage('bot', 'Sorry, I couldn’t fetch that info right now.'));
        
    }
});