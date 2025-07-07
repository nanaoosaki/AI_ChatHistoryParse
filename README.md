# Chat Archive MVP

A minimal viable product for chat archiving with Cloudflare Worker backend and plain HTML frontend.

## Features

- **POST /ingest**: Accept URL or file upload, return messages JSON
- **POST /summarise**: Accept messages JSON, return summary and sources
- **POST /chat**: Accept conversation ID and question, return stubbed answer
- Frontend with two download buttons for messages and summary
- Docker setup for local development

## Stack

- **Backend**: Cloudflare Worker (Edge runtime)
- **Frontend**: Plain HTML + JavaScript + Tailwind CSS
- **Development**: Docker + docker-compose

## Quick Start

1. **Clone and run**:
   ```bash
   unzip chat-archive-mvp.zip
   cd chat-archive-mvp
   docker compose up
   ```

2. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8787

## API Endpoints

### POST /ingest
Accept URL or file upload and return extracted messages.

**Request (URL)**:
```json
{
  "url": "https://example.com/chat-export"
}
```

**Request (File Upload)**:
```
Content-Type: multipart/form-data
file: [uploaded file]
```

**Response**:
```json
{
  "messages": [
    {
      "id": 1,
      "timestamp": "2023-12-01T10:00:00Z",
      "sender": "user1",
      "content": "Message content",
      "type": "text"
    }
  ]
}
```

### POST /summarise
Generate summary from messages.

**Request**:
```json
{
  "messages": [/* array of message objects */]
}
```

**Response**:
```json
{
  "summary": "Generated summary text",
  "sources": [
    {
      "id": 1,
      "sender": "user1",
      "timestamp": "2023-12-01T10:00:00Z",
      "snippet": "Message snippet..."
    }
  ]
}
```

### POST /chat
Ask questions about the conversation.

**Request**:
```json
{
  "conversation_id": "conv_123",
  "question": "What was discussed?"
}
```

**Response**:
```json
{
  "response": "This is a stub answer.",
  "conversation_id": "conv_123",
  "timestamp": "2023-12-01T10:00:00Z"
}
```

## Development

### Local Development without Docker

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Cloudflare Worker**:
   ```bash
   npm run dev
   ```

3. **Serve frontend** (in another terminal):
   ```bash
   npx http-server public -p 5173 --cors
   ```

### Project Structure

```
chat-archive-mvp/
├── src/
│   └── index.js          # Cloudflare Worker script
├── public/
│   ├── index.html        # Frontend HTML
│   └── app.js           # Frontend JavaScript
├── package.json         # Node.js dependencies
├── wrangler.toml        # Cloudflare Worker config
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
└── README.md           # This file
```

## Notes

- **No real API keys**: Uses placeholder `OPENAI_API_KEY = "TEST"`
- **Stubbed responses**: All LLM calls are mocked for demonstration
- **CORS enabled**: Frontend can communicate with backend
- **Edge runtime**: Designed for Cloudflare Workers deployment

## Deployment

To deploy to Cloudflare Workers:

```bash
npm run deploy
```

Make sure to configure your Cloudflare account and update `wrangler.toml` with your account details.

