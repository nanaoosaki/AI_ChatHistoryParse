# Chat Archive MVP (Static GitHub Pages Version)

A minimal viable product for chat archiving with client-side logic, ready for deployment on GitHub Pages.

## Features

- **Client-side logic**: All operations (ingest, summarise, chat) run in the browser.
- **Stubbed API**: Uses `apiStub.js` to simulate backend responses.
- **Ready for wiring**: Exposes `window.API` for easy integration with a real backend.
- **Static build**: Simple build process for static hosting.

## Stack

- **Frontend**: Plain HTML + JavaScript + Tailwind CSS
- **API**: Client-side stubs (`apiStub.js`)

## Quick Start

1. **Build and preview**:
   ```bash
   npm i && npm run build && npx serve dist
   ```

2. **Access the application**:
   - Open your browser to the URL provided by `npx serve` (usually http://localhost:3000).

## API Stubs

The application uses client-side stubs to simulate API calls. These can be found in `public/apiStub.js`.

- `ingest()`: Simulates ingesting messages from a URL or file.
- `summarise()`: Generates a stubbed summary of messages.
- `chat()`: Returns a stubbed chat response.

## Development

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start a development server**:
   ```bash
   npx serve public
   ```

### Project Structure

```
chat-archive-mvp/
├── public/
│   ├── index.html        # Frontend HTML
│   ├── app.js            # Frontend JavaScript
│   └── apiStub.js        # Client-side API stubs
├── package.json         # Node.js dependencies
└── README.md            # This file
```

## Deployment

This project is designed for static hosting platforms like GitHub Pages.

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` directory** to your hosting provider.

For GitHub Pages, you can push the contents of the `dist` directory to a `gh-pages` branch.

