# Chat Archive MVP - Agent-Enhanced Architecture

A comprehensive chat archiving platform with AI-powered agent center, featuring a 3-column interface and full-stack backend infrastructure.

## 🏗️ Architecture Overview

### **Design Pattern**: 3-Column Layout with Agent Enhancement
- **Left Column (1/3)**: Data Pipeline (Ingest → Summarize → Download)
- **Middle Column (1/3)**: Interactive Chat Interface
- **Right Column (1/3)**: AI Agent Center with Analytics

### **Technology Stack**
- **Frontend**: HTML5 + Vanilla JavaScript + Tailwind CSS
- **Backend**: Cloudflare Workers (Edge Computing)
- **API Layer**: RESTful endpoints with CORS support
- **Deployment**: Docker containerization + Static hosting
- **Development**: Node.js toolchain with hot reload

## 📁 Project Structure

```
chat-archive-mvp/
├── Frontend (Root Level)
│   ├── index.html          # Main UI with 3-column layout
│   ├── app.js              # Frontend logic and state management
│   └── apiStub.js          # Client-side API simulation
├── Backend Infrastructure
│   ├── index.js            # Cloudflare Worker endpoints
│   ├── wrangler.toml       # Worker configuration
│   └── docker-compose.yml  # Multi-service orchestration
├── Build System
│   ├── package.json        # Dependencies and scripts
│   └── Dockerfile          # Container definition
└── Documentation
    └── README.md           # This file
```

## 🔧 Core Components

### **1. Frontend Application (`index.html` + `app.js`)**

#### **UI Layout Structure**
```html
<div class="flex flex-1 overflow-hidden">
  <!-- Left: Data Pipeline (w-1/3) -->
  <div class="w-1/3 p-4 overflow-y-auto">
    <section id="ingest">1. Ingest Data</section>
    <section id="summarize">2. Summarize</section>
    <section id="download">3. Download</section>
  </div>
  
  <!-- Middle: Chat Interface (w-1/3) -->
  <div class="w-1/3 bg-gray-800 flex flex-col p-4">
    <section id="chat">4. Chat</section>
    <div id="chatHistory"></div>
    <input id="questionInput" />
  </div>
  
  <!-- Right: Agent Center (w-1/3) -->
  <div class="w-1/3 bg-gray-200 flex flex-col p-4">
    <section id="agent">5. Agent</section>
    <div id="keyTakeaways"></div>
    <div id="actionItems"></div>
    <div id="topicChart"></div>
  </div>
</div>
```

#### **State Management**
```javascript
// Global Application State
let currentMessages = null;      // Array of ingested messages
let currentSummary = null;       // Summary object with sources
let conversationId = string;     // Unique conversation identifier
let chatHistory = [];            // Chat message history array
```

### **2. API Layer (`apiStub.js` + `index.js`)**

#### **Frontend API Interface**
```javascript
window.API = {
    ingest: (payload) => Promise<{messages: Message[]}>,
    summarise: (messages) => Promise<{summary: string, sources: Source[]}>,
    chat: (conversationId, question) => Promise<{response: string, conversation_id: string, timestamp: string}>
};
```

#### **Backend Endpoints** (`index.js`)
- **Base URL**: Cloudflare Worker deployment
- **CORS**: Fully configured for cross-origin requests
- **Content Types**: JSON + FormData support

## 📊 Detailed Function Specifications

### **Data Ingestion Functions**

#### **`ingestFromUrl()`**
```javascript
// Input: URL string from #urlInput
// Output: Updates currentMessages state
// Side Effects: Enables summarize button, shows status

async function ingestFromUrl() {
  Input: {
    url: string (from DOM element #urlInput)
  }
  
  API Call: POST /ingest
  Request: { url: string }
  Response: { messages: Message[] }
  
  State Changes:
  - currentMessages = data.messages
  - Enable #summarizeBtn, #downloadMessagesBtn
  - Display messages in #ingestResults
  
  Error Handling: Try-catch with user status notification
}
```

#### **`ingestFromFile()`**
```javascript
// Input: File object from #fileInput
// Output: Updates currentMessages state
// Side Effects: Same as ingestFromUrl()

async function ingestFromFile() {
  Input: {
    file: File (from DOM element #fileInput)
    acceptedTypes: [".txt", ".json", ".csv"]
  }
  
  API Call: POST /ingest
  Request: FormData with file
  Response: { messages: Message[] }
  
  State Changes: [Same as ingestFromUrl]
}
```

### **Summarization Functions**

#### **`summarizeMessages()`**
```javascript
// Input: Uses currentMessages state
// Output: Updates currentSummary state
// Prerequisites: Requires currentMessages to be populated

async function summarizeMessages() {
  Prerequisites: currentMessages !== null
  
  Input: currentMessages (array of Message objects)
  
  API Call: POST /summarise
  Request: { messages: Message[] }
  Response: { summary: string, sources: Source[] }
  
  State Changes:
  - currentSummary = response data
  - Enable #downloadSummaryBtn
  - Display summary in #summaryResults
}
```

### **Chat Interface Functions**

#### **`askQuestion()`**
```javascript
// Input: Question string from #questionInput
// Output: Updates chatHistory state
// Side Effects: Renders chat history, clears input

async function askQuestion() {
  Input: {
    question: string (from DOM element #questionInput)
    conversationId: string (global state)
  }
  
  State Updates (Pre-API):
  - Add user message to chatHistory[]
  - Call renderChatHistory()
  
  API Call: POST /chat
  Request: { conversation_id: string, question: string }
  Response: { response: string, conversation_id: string, timestamp: string }
  
  State Updates (Post-API):
  - Add AI response to chatHistory[]
  - Call renderChatHistory()
  - Clear #questionInput
}
```

#### **`renderChatHistory()`**
```javascript
// Input: Uses chatHistory state
// Output: Updates DOM #chatHistory element
// Features: Auto-scroll, timestamp display, user/AI differentiation

function renderChatHistory() {
  Input: chatHistory (array of chat objects)
  
  DOM Update: #chatHistory element
  
  Message Format:
  {
    type: "user" | "ai",
    content: string,
    timestamp: ISO string
  }
  
  Visual Styling:
  - User messages: bg-blue-600, right-aligned
  - AI messages: bg-gray-600, left-aligned
  - Auto-scroll to bottom
}
```

### **Data Export Functions**

#### **`downloadMessages()` & `downloadSummary()`**
```javascript
// Input: Uses global state (currentMessages/currentSummary)
// Output: Browser file download
// Format: JSON with proper formatting

function downloadMessages() {
  Prerequisites: currentMessages !== null
  Output: File download "chat-messages.json"
  Format: JSON.stringify(currentMessages, null, 2)
}

function downloadSummary() {
  Prerequisites: currentSummary !== null
  Output: File download "chat-summary.json"
  Format: JSON.stringify(currentSummary, null, 2)
}
```

## 🌐 Backend API Specifications

### **POST /ingest**
```javascript
// Content-Type: application/json OR multipart/form-data

Request Formats:
1. URL Ingestion:
   { url: string }

2. File Upload:
   FormData { file: File }

Response:
{
  messages: [
    {
      id: number,
      timestamp: ISO string,
      sender: string,
      content: string,
      type: "text"
    }
  ]
}

Error Response:
{
  error: string
}
```

### **POST /summarise**
```javascript
// Content-Type: application/json

Request:
{
  messages: Message[]
}

Response:
{
  summary: string,
  sources: [
    {
      id: number,
      sender: string,
      timestamp: ISO string,
      snippet: string (truncated to 100 chars)
    }
  ]
}
```

### **POST /chat**
```javascript
// Content-Type: application/json

Request:
{
  conversation_id: string,
  question: string
}

Response:
{
  response: string,
  conversation_id: string,
  timestamp: ISO string
}
```

## 🚀 Deployment Architecture

### **Development Environment**
```bash
# Local Static Serving
npm install           # Install dependencies
npm run dev          # Serve directly from root on http://localhost:3000
# OR
npx serve . --cors   # Alternative direct serving
```

### **Docker Containerization**
```yaml
# docker-compose.yml
services:
  worker:           # Cloudflare Worker backend
    ports: ["8787:8787"]
    command: ["wrangler", "dev"]
  
  frontend:         # Static file server
    ports: ["5173:5173"]
    command: ["npx", "http-server", "public"]
```

### **Cloudflare Workers**
```toml
# wrangler.toml
name = "chat-archive-mvp"
main = "src/index.js"
compatibility_date = "2023-12-01"

[env.development]
OPENAI_API_KEY = "TEST"  # Placeholder for production
```

## 🔍 Agent Center Architecture

### **Current Implementation** (UI Only)
```html
<!-- Static UI Components -->
<div class="agent-center">
  <select>Run Extractors</select>
  <ul class="key-takeaways">...</ul>
  <ul class="action-items">...</ul>
  <div class="topic-chart">...</div>
</div>
```

### **Planned Agent Functions** (Not Yet Implemented)
```javascript
// Future API Extensions
POST /agent/extract     // Run data extractors
POST /agent/takeaways   // Generate key insights
POST /agent/actions     // Identify action items
POST /agent/topics      // Classify conversation topics
```

## 🔗 Data Flow Architecture

```
User Input → Frontend → API Layer → Backend → Response → UI Update

1. Ingest Flow:
   URL/File → ingestFrom*() → POST /ingest → Worker → Messages → State Update

2. Summarize Flow:
   Messages → summarizeMessages() → POST /summarise → Worker → Summary → UI Display

3. Chat Flow:
   Question → askQuestion() → POST /chat → Worker → Response → Chat History

4. Download Flow:
   State Data → download*() → JSON Blob → Browser Download
```

## ⚠️ Current Limitations & Architectural Gaps

### **1. Agent Center**
- **Status**: UI-only implementation
- **Gap**: No backend logic for agent functions
- **Required**: ML/AI integration for takeaways, actions, topics

### **2. API Stubs**
- **Status**: Client-side simulation only
- **Gap**: Real backend processing not connected
- **Required**: Replace apiStub.js with real HTTP calls

### **3. Authentication**
- **Status**: Not implemented
- **Gap**: No user management or session handling
- **Required**: Auth layer for multi-user support

### **4. Data Persistence**
- **Status**: Session-only storage
- **Gap**: No database or permanent storage
- **Required**: Database integration for conversation history

### **5. Error Handling**
- **Status**: Basic try-catch with user notifications
- **Gap**: No retry logic or offline support
- **Required**: Robust error recovery and offline capabilities

## 🎯 Next Development Priorities

1. **Connect Real Backend**: Replace apiStub.js with HTTP API calls
2. **Implement Agent Logic**: Add ML/AI processing for agent features  
3. **Add Authentication**: User management and session handling
4. **Database Integration**: Persistent storage for conversations
5. **Enhanced Error Handling**: Retry logic and offline support
6. **Performance Optimization**: Lazy loading and caching strategies

## 🧪 Testing & Quality Assurance

### **Current Status**
- Manual testing via browser interface
- No automated test suite
- Basic error handling with user feedback

### **Recommended Testing Strategy**
- Unit tests for individual functions
- Integration tests for API endpoints
- E2E tests for complete user workflows
- Performance testing for large message sets

This architecture provides a solid foundation for a chat archiving platform with room for significant enhancement in the agent intelligence and backend robustness areas.

