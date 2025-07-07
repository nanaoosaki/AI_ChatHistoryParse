// Cloudflare Worker for chat-archive-mvp
const OPENAI_API_KEY = "TEST"; // Placeholder as requested

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight requests
function handleCORS(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
  return null;
}

// POST /ingest - accept { url } or file upload, return { messages } JSON
async function handleIngest(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    let messages = [];
    
    if (contentType.includes('application/json')) {
      // Handle JSON payload with URL
      const body = await request.json();
      if (body.url) {
        // Stub: simulate extracting messages from URL
        messages = [
          {
            id: 1,
            timestamp: new Date().toISOString(),
            sender: "user1",
            content: `Stubbed message from URL: ${body.url}`,
            type: "text"
          },
          {
            id: 2,
            timestamp: new Date().toISOString(),
            sender: "user2",
            content: "This is a stubbed response message",
            type: "text"
          }
        ];
      }
    } else if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file');
      
      if (file) {
        // Stub: simulate extracting messages from file
        messages = [
          {
            id: 1,
            timestamp: new Date().toISOString(),
            sender: "user1",
            content: `Stubbed message from file: ${file.name}`,
            type: "text"
          },
          {
            id: 2,
            timestamp: new Date().toISOString(),
            sender: "user2",
            content: "This is a stubbed message extracted from uploaded file",
            type: "text"
          }
        ];
      }
    }
    
    return new Response(JSON.stringify({ messages }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

// POST /summarise - accept messages JSON, return { summary, sources }
async function handleSummarise(request) {
  try {
    const body = await request.json();
    const messages = body.messages || [];
    
    // Stub: fake the LLM call with a stubbed string
    const summary = `This is a stubbed summary of ${messages.length} messages. The conversation covered various topics including user interactions and responses. Key themes identified: communication patterns, user engagement, and content exchange.`;
    
    const sources = messages.map(msg => ({
      id: msg.id,
      sender: msg.sender,
      timestamp: msg.timestamp,
      snippet: msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '')
    }));
    
    return new Response(JSON.stringify({ summary, sources }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

// POST /chat - accept { conversation_id, question }, return stubbed answer
async function handleChat(request) {
  try {
    const body = await request.json();
    const { conversation_id, question } = body;
    
    // Stub: return fixed response
    const response = "This is a stub answer.";
    
    return new Response(JSON.stringify({ 
      response,
      conversation_id,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

// Main request handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle CORS preflight
    const corsResponse = handleCORS(request);
    if (corsResponse) return corsResponse;
    
    // Route requests
    switch (path) {
      case '/ingest':
        if (request.method === 'POST') {
          return handleIngest(request);
        }
        break;
        
      case '/summarise':
        if (request.method === 'POST') {
          return handleSummarise(request);
        }
        break;
        
      case '/chat':
        if (request.method === 'POST') {
          return handleChat(request);
        }
        break;
        
      default:
        return new Response('Not Found', { 
          status: 404,
          headers: corsHeaders,
        });
    }
    
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: corsHeaders,
    });
  },
};

