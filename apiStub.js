// apiStub.js - Client-side API stubs

export async function ingest(payload) {
    console.log("apiStub.ingest called with:", payload);
    let messages = [];

    if (payload.url) {
        messages = [
            { id: 1, timestamp: new Date().toISOString(), sender: "user1", content: `Stubbed message from URL: ${payload.url}`, type: "text" },
            { id: 2, timestamp: new Date().toISOString(), sender: "user2", content: "This is a stubbed response message from URL ingest", type: "text" }
        ];
    } else if (payload.file) {
        messages = [
            { id: 1, timestamp: new Date().toISOString(), sender: "user1", content: `Stubbed message from file: ${payload.file.name}`, type: "text" },
            { id: 2, timestamp: new Date().toISOString(), sender: "user2", content: "This is a stubbed message extracted from uploaded file", type: "text" }
        ];
    } else {
        messages = [
            { id: 1, timestamp: new Date().toISOString(), sender: "system", content: "No URL or file provided, returning default stubbed messages.", type: "text" }
        ];
    }

    return { messages };
}

export async function summarise(messages) {
    console.log("apiStub.summarise called with messages count:", messages.length);
    const summary = `This is a client-side stubbed summary of ${messages.length} messages. The conversation covered various topics including user interactions and responses. Key themes identified: communication patterns, user engagement, and content exchange.`;
    const sources = messages.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        timestamp: msg.timestamp,
        snippet: msg.content.substring(0, 100) + (msg.content.length > 100 ? 
'...' : 
'')
    }));
    return { summary, sources };
}

export async function chat(conversation_id, question) {
    console.log(`apiStub.chat called for conversation ${conversation_id} with question: ${question}`);
    const response = "This is a client-side stub answer.";
    return { response, conversation_id, timestamp: new Date().toISOString() };
}


