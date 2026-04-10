# 🌬️ AirBloom Tracker - Backend API

Secure Node.js backend for fetching IoT sensor data from ThingSpeak and serving it to the frontend.

## 📁 Project Structure

```
backend/
├── server.js                 # Main server file
├── routes/
│   └── dataRoutes.js        # API route definitions
├── controllers/
│   └── dataController.js    # Request handlers
├── services/
│   └── thingSpeakService.js # ThingSpeak API integration
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
├── package.json             # Dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and add your ThingSpeak credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
THINGSPEAK_CHANNEL_ID=your_channel_id
THINGSPEAK_READ_API_KEY=your_read_api_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start at: `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /api/data/health
```

**Response:**
```json
{
  "success": true,
  "message": "AirBloom Backend API is running",
  "timestamp": "2026-04-07T12:00:00.000Z",
  "environment": "development"
}
```

---

### Get Latest Reading
```
GET /api/data/latest
```

**Response:**
```json
{
  "success": true,
  "data": {
    "temperature": 24.5,
    "humidity": 65.2,
    "aqi": 85,
    "location": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "timestamp": "2026-04-07T12:00:00Z",
    "entryId": 12345
  }
}
```

---

### Get Historical Data
```
GET /api/data/history?count=20
```

**Query Parameters:**
- `count` (optional): Number of readings to fetch (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "temperature": 24.5,
      "humidity": 65.2,
      "aqi": 85,
      "location": {
        "lat": 28.6139,
        "lng": 77.209
      },
      "timestamp": "2026-04-07T12:00:00Z",
      "entryId": 12345
    },
    // ... more readings
  ]
}
```

---

### Get Channel Info
```
GET /api/data/channel-info
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123456,
    "name": "AirBloom Sensor",
    "description": "Air quality monitoring",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-04-07T12:00:00Z",
    "last_entry_id": 12345
  }
}
```

## 🔧 ThingSpeak Field Mapping

| ThingSpeak Field | Application Field | Type |
|-----------------|-------------------|------|
| field1 | temperature | number (°C) |
| field2 | humidity | number (%) |
| field3 | aqi | number |
| field4 | location.lat | number |
| field5 | location.lng | number |

## 🧪 Testing

### Using Browser
Open in browser:
- http://localhost:5000/api/data/health
- http://localhost:5000/api/data/latest
- http://localhost:5000/api/data/history

### Using cURL

**Health check:**
```bash
curl http://localhost:5000/api/data/health
```

**Latest reading:**
```bash
curl http://localhost:5000/api/data/latest
```

**Historical data:**
```bash
curl http://localhost:5000/api/data/history?count=10
```

### Using Postman
1. Import the endpoints
2. Set base URL: `http://localhost:5000`
3. Test each endpoint

## 🔒 Security Features

- ✅ API keys stored in environment variables
- ✅ CORS configured for frontend only
- ✅ Request timeout (10 seconds)
- ✅ Error handling for all endpoints
- ✅ Input validation
- ✅ No sensitive data in responses

## 🐛 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `404` - No data found
- `500` - Server error

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| THINGSPEAK_CHANNEL_ID | Your ThingSpeak channel ID | Yes | - |
| THINGSPEAK_READ_API_KEY | Your ThingSpeak read API key | Yes | - |
| PORT | Server port | No | 5000 |
| NODE_ENV | Environment (development/production) | No | development |
| FRONTEND_URL | Frontend URL for CORS | No | http://localhost:5173 |

## 🔄 Data Flow

```
ESP32 → ThingSpeak → Backend API → Frontend
```

1. **ESP32** sends sensor data to ThingSpeak
2. **ThingSpeak** stores the data
3. **Backend API** fetches data from ThingSpeak
4. **Frontend** requests data from Backend API

## 📦 Dependencies

- **express** - Web framework
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **axios** - HTTP client for ThingSpeak API

**Dev Dependencies:**
- **nodemon** - Auto-reload during development

## 🚀 Deployment

### Heroku
```bash
heroku create airbloom-backend
heroku config:set THINGSPEAK_CHANNEL_ID=your_id
heroku config:set THINGSPEAK_READ_API_KEY=your_key
git push heroku main
```

### Railway
```bash
railway init
railway add
railway up
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Troubleshooting

### Server won't start
- Check if port 5000 is available
- Verify `.env` file exists
- Check Node.js version (requires 14+)

### No data from ThingSpeak
- Verify channel ID and API key
- Check ThingSpeak channel has data
- Test ThingSpeak API directly in browser

### CORS errors
- Verify `FRONTEND_URL` in `.env`
- Check frontend is running on correct port

## 📚 Additional Resources

- [ThingSpeak API Documentation](https://www.mathworks.com/help/thingspeak/rest-api.html)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 📄 License

MIT License

---

**Backend is ready! Start the server and test the endpoints.** 🚀
