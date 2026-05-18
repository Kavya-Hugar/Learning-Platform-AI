# LearnFlow - AI-Powered Learning Platform

A modern online learning platform with an integrated AI assistant to help students discover courses and guide their learning journey.

## Features

- 🎓 **Course Catalog**: Browse courses across Programming, Design, Data Science, Business, and DevOps
- 🤖 **AI Assistant**: Built-in AI chat to help with course recommendations and learning guidance
- 📊 **Progress Tracking**: Automatic progress saving as you watch video lessons
- 🏆 **Certificates**: Earn certificates upon course completion
- 🔓 **Sequential Learning**: Videos unlock sequentially as you complete lessons
- 👤 **User Profiles**: Track enrolled courses and overall progress
- 🎨 **Modern UI**: Clean, responsive dark-themed interface

## Tech Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- LocalStorage for data persistence
- No build tools required

### Backend
- Node.js + Express
- Anthropic Claude API for AI responses
- CORS enabled for cross-origin requests

## Project Structure

```
learnflow_1/
├── learnflow/              # Frontend (Vercel)
│   ├── index.html         # Main HTML file
│   ├── css/
│   │   └── style.css      # Styles
│   └── js/
│       ├── app.js         # Main application logic
│       ├── data.js        # Course data
│       └── chat.js        # AI chat functionality
├── server/                # Backend (Render)
│   ├── index.js           # Express server
│   ├── package.json       # Dependencies
│   ├── .env.example       # Environment variables template
│   └── .gitignore
├── README.md
└── DEPLOYMENT.md          # Deployment guide
```

## Local Development

### Frontend (Static)

1. Navigate to the learnflow directory:
```bash
cd learnflow
```

2. Start a simple HTTP server:
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js
npx serve
```

3. Open http://localhost:8000 in your browser

### Backend (API Server)

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Add your Anthropic API key to `.env`:
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=5000
```

5. Start the server:
```bash
npm start
```

6. The API will be available at http://localhost:5000

### Connecting Frontend to Backend

In `learnflow/js/chat.js`, update the API_BASE_URL:
```javascript
const API_BASE_URL = 'http://localhost:5000'; // Local development
// const API_BASE_URL = 'https://your-render-app.onrender.com'; // Production
```

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set the root directory to `learnflow`
4. Deploy

### Backend (Render)

1. Push your code to GitHub
2. Import the repository in Render
3. Set the root directory to `server`
4. Add environment variable: `ANTHROPIC_API_KEY`
5. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Environment Variables

### Backend (.env)
- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude
- `PORT`: Server port (default: 5000)

## API Endpoints

### POST /api/chat
Send a message to the AI assistant.

**Request:**
```json
{
  "message": "What courses do you have for programming?"
}
```

**Response:**
```json
{
  "response": "We have great programming courses! Check out our Programming category for courses on JavaScript, React, Python, and more."
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "LearnFlow Backend is running"
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please open an issue on GitHub.
