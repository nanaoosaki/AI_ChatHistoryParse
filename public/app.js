// Chat Archive MVP Frontend JavaScript

// Configuration
const API_BASE_URL = 'http://localhost:8787'; // Cloudflare Worker dev server default port

// Global state
let currentMessages = null;
let currentSummary = null;
let conversationId = generateConversationId();

// Generate a unique conversation ID
function generateConversationId() {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Utility functions
function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `fixed bottom-4 right-4 px-4 py-2 rounded-md text-white ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 
        'bg-blue-500'
    }`;
    statusEl.classList.remove('hidden');
    
    setTimeout(() => {
        statusEl.classList.add('hidden');
    }, 3000);
}

function setLoading(elementId, isLoading) {
    const element = document.getElementById(elementId);
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

function enableButton(buttonId) {
    document.getElementById(buttonId).disabled = false;
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// API Functions

// POST /ingest - from URL
async function ingestFromUrl() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim();
    
    if (!url) {
        showStatus('Please enter a URL', 'error');
        return;
    }
    
    setLoading('urlBtn', true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/ingest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        currentMessages = data.messages;
        
        displayMessages(data.messages);
        enableButton('summarizeBtn');
        enableButton('downloadMessagesBtn');
        showStatus('Successfully ingested messages from URL', 'success');
        
    } catch (error) {
        console.error('Error ingesting from URL:', error);
        showStatus('Error ingesting from URL: ' + error.message, 'error');
    } finally {
        setLoading('urlBtn', false);
    }
}

// POST /ingest - from file
async function ingestFromFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        showStatus('Please select a file', 'error');
        return;
    }
    
    setLoading('fileBtn', true);
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE_URL}/ingest`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        currentMessages = data.messages;
        
        displayMessages(data.messages);
        enableButton('summarizeBtn');
        enableButton('downloadMessagesBtn');
        showStatus('Successfully ingested messages from file', 'success');
        
    } catch (error) {
        console.error('Error ingesting from file:', error);
        showStatus('Error ingesting from file: ' + error.message, 'error');
    } finally {
        setLoading('fileBtn', false);
    }
}

// POST /summarise
async function summarizeMessages() {
    if (!currentMessages) {
        showStatus('No messages to summarize', 'error');
        return;
    }
    
    setLoading('summarizeBtn', true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/summarise`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: currentMessages })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        currentSummary = data;
        
        displaySummary(data);
        enableButton('downloadSummaryBtn');
        showStatus('Successfully generated summary', 'success');
        
    } catch (error) {
        console.error('Error summarizing messages:', error);
        showStatus('Error summarizing messages: ' + error.message, 'error');
    } finally {
        setLoading('summarizeBtn', false);
    }
}

// POST /chat
async function askQuestion() {
    const questionInput = document.getElementById('questionInput');
    const question = questionInput.value.trim();
    
    if (!question) {
        showStatus('Please enter a question', 'error');
        return;
    }
    
    setLoading('chatBtn', true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                conversation_id: conversationId,
                question 
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        displayChatResponse(question, data.response);
        questionInput.value = '';
        showStatus('Question answered', 'success');
        
    } catch (error) {
        console.error('Error asking question:', error);
        showStatus('Error asking question: ' + error.message, 'error');
    } finally {
        setLoading('chatBtn', false);
    }
}

// Display Functions

function displayMessages(messages) {
    const resultsEl = document.getElementById('ingestResults');
    const displayEl = document.getElementById('messagesDisplay');
    
    displayEl.innerHTML = messages.map(msg => `
        <div class="border-b border-gray-200 pb-2 mb-2">
            <div class="font-medium">${msg.sender} - ${new Date(msg.timestamp).toLocaleString()}</div>
            <div class="text-gray-600">${msg.content}</div>
        </div>
    `).join('');
    
    resultsEl.classList.remove('hidden');
}

function displaySummary(data) {
    const resultsEl = document.getElementById('summaryResults');
    const summaryEl = document.getElementById('summaryDisplay');
    const sourcesEl = document.getElementById('sourcesDisplay');
    
    summaryEl.textContent = data.summary;
    
    sourcesEl.innerHTML = data.sources.map(source => `
        <div class="border-b border-gray-200 pb-2 mb-2">
            <div class="font-medium">${source.sender} - ${new Date(source.timestamp).toLocaleString()}</div>
            <div class="text-gray-600">${source.snippet}</div>
        </div>
    `).join('');
    
    resultsEl.classList.remove('hidden');
}

function displayChatResponse(question, response) {
    const resultsEl = document.getElementById('chatResults');
    
    const chatItem = document.createElement('div');
    chatItem.className = 'border border-gray-200 rounded-md p-3';
    chatItem.innerHTML = `
        <div class="font-medium text-blue-600 mb-1">Q: ${question}</div>
        <div class="text-gray-700">A: ${response}</div>
        <div class="text-xs text-gray-500 mt-1">${new Date().toLocaleString()}</div>
    `;
    
    resultsEl.appendChild(chatItem);
}

// Download Functions

function downloadMessages() {
    if (!currentMessages) {
        showStatus('No messages to download', 'error');
        return;
    }
    
    downloadJSON(currentMessages, 'chat-messages.json');
    showStatus('Messages downloaded', 'success');
}

function downloadSummary() {
    if (!currentSummary) {
        showStatus('No summary to download', 'error');
        return;
    }
    
    downloadJSON(currentSummary, 'chat-summary.json');
    showStatus('Summary downloaded', 'success');
}

// Event Listeners

// Allow Enter key to submit forms
document.getElementById('urlInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        ingestFromUrl();
    }
});

document.getElementById('questionInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        askQuestion();
    }
});

// Initialize
console.log('Chat Archive MVP loaded');
console.log('Conversation ID:', conversationId);

