# Weather App

A full-stack weather application where users can check live weather for Australian cities and chat with others in real-time. Built with React, Node.js, Socket.IO, and deployed on AWS using Terraform.

Live demo: <https://d3l9k5ybmql9n9.cloudfront.net>

## How It Works

1. **Login** -- Authentication is handled by AWS Cognito. There is no signup functionality. A default account is pre-configured in the user pool: username `admin`, password `8888888b`.

2. **View Weather** -- After logging in, select a city (Sydney, Melbourne, or Brisbane) to see its current weather data (temperature, wind speed, weather condition). The app polls the Open-Meteo API every 60 seconds and pushes updated data to all connected users via WebSocket.

3. **Connection Status** -- The top-right corner displays a "Connected" indicator showing the WebSocket connection status with the backend. A "Logout" button is also available there.

4. **Live Messaging** -- Users in the same city room can send and receive messages in real-time. To test this feature: open the app in two separate browser windows, log in on both, select the same city, then send a message from one window -- it will appear instantly in the other.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS, Vite |
| Backend | Node.js, Express 5, Socket.IO |
| Auth | AWS Cognito (frontend) + aws-jwt-verify (backend JWT validation) |
| Weather API | [Open-Meteo](https://open-meteo.com/) (free, no API key required) |
| Infrastructure | Terraform (IaC) -- S3, CloudFront, EC2, Cognito |

## Architecture

```
Browser
  |
  v
CloudFront (HTTPS)
  |-- /*            --> S3 (React SPA)
  |-- /socket.io/*  --> EC2 (Node.js + Socket.IO)
```

- **Single CloudFront distribution** serves both frontend and backend, providing HTTPS for free (no ALB needed)
- **S3 + OAC**: Frontend static files in a private S3 bucket, accessed only through CloudFront (Origin Access Control)
- **EC2 + pm2**: Backend process managed by pm2 for auto-restart and persistence
- **SPA routing**: CloudFront custom error responses (403/404 -> index.html) for React BrowserRouter support
- **WebSocket support**: CloudFront path-based routing forwards `/socket.io/*` to EC2 with caching disabled

## Project Structure

```
├── client/             # React frontend (Vite)
│   └── src/
│       ├── components/ # Chat, Header, WeatherDisplay, ProtectedRoute
│       ├── hooks/      # useSocket (Socket.IO + Cognito JWT)
│       └── pages/      # LoginPage, HomePage
├── server/             # Node.js backend
│   └── src/
│       ├── config/     # City coordinates
│       ├── services/   # Weather polling (Open-Meteo API)
│       └── socket/     # Socket.IO handlers + JWT middleware
└── infra/              # Terraform
    ├── cloudfront.tf   # S3 bucket, OAC, CloudFront distribution
    ├── ec2.tf          # EC2 instance, security group, SSH key
    ├── cognito.tf      # User pool + app client
    └── user-data.sh.tpl# EC2 bootstrap script
```

## Key Design Decisions

- **CloudFront over ALB for HTTPS**: CloudFront provides free HTTPS termination, saving ~$16/month compared to an ALB
- **JWT verification on WebSocket**: Every Socket.IO connection is authenticated by verifying the Cognito ID token server-side
- **Smart polling**: Weather API is only polled for cities that have at least one connected user, reducing unnecessary API calls
- **Terraform IaC**: All infrastructure is codified and reproducible with a single `terraform apply`

## Running Locally

Prerequisites: Node.js 22+

```bash
# 1. Setup backend
cd server
cp .env.example .env
npm install
npm run dev

# 2. Setup frontend (in a separate terminal)
cd client
cp .env.example .env
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. Log in with the demo account mentioned above.

## Testing

```bash
cd server && npm test
cd client && npm test
```
