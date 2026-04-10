# 🚀 Quick Run Guide - AirBloom Backend

## ✅ Backend is Ready!

All files are implemented and ready to run. Follow these exact steps:

---

## 📋 Step 1: Install Dependencies

```bash
cd backend
npm install
```

This will install:
- express
- cors
- dotenv
- axios
- nodemon (dev dependency)

---

## 🔧 Step 2: Configure Environment Variables

**Option A: Copy and edit**
```bash
cp .env.example .env
```

Then edit `.env` file with your ThingSpeak credentials:
```env
THINGSPEAK_CHANNEL_ID=123456
THINGSPEAK_READ_API_KEY=ABCDEFGHIJKLMNOP
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Option B: Create .env manually**
Create a file named `.env` in the `backend/` directory with:
```env
THINGSPEAK_CHANNEL_ID=your_channel_id
THINGSPEAK_READ_API_KEY=your_read_api_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**⚠️ Important:** Replace `your_channel_id` and `your_read_api_key` with your actual ThingSpeak credentials!

---

## 🚀 Step 3: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
==================================================
🚀 AirBloom Tracker Backend Server
==================================================
📡 Server running on: http://localhost:5000
🌐 Frontend URL: http://localhost:5173
🔧 Environment: development
==================================================

📋 Available Endpoints:
   GET  /api/data/health       - Health check
   GET  /api/data/latest       - Latest reading
   GET  /api/data/history      - Historical data
   GET  /api/data/channel-info - Channel info
==================================================

✅ Server is ready to accept requests!
```

---

## 🧪 Step 4: Test the Endpoints

### Option A: Using Browser

Open these URLs in your browser:

1. **Health Check:**
   ```
   http://localhost:5000/api/data/health
   ```

2. **Latest Reading:**
   ```
   http://localhost:5000/api/data/latest
   ```

3. **Historical Data:**
   ```
   http://localhost:5000/api/data/history
   ```

4. **Channel Info:**
   ```
   http://localhost:5000/api/data/channel-info
   ```

### Option B: Using cURL

```bash
# Health check
curl http://localhost:5000/api/data/health

# Latest reading
curl http://localhost:5000/api/data/latest

# History (default 20 records)
curl http://localhost:5000/api/data/history

# History (custom count)
curl http://localhost:5000/api/data/history?count=10

# Channel info
curl http://localhost:5000/api/data/channel-info
```

### Option C: Using Test Script

```bash
npm test
```

This runs the automated test script that checks all endpoints.

---

## 📊 Expected Response Format

### Latest Reading
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

### Historical Data
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
    }
    // ... more readings
  ]
}
```

---

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with ThingSpeak credentials
- [ ] Server starts without errors
- [ ] Health check returns success
- [ ] Latest endpoint returns data
- [ ] History endpoint returns data
- [ ] No errors in console

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution:**
```bash
npm install
```

### Issue: "ThingSpeak credentials not configured"
**Solution:** Check `.env` file exists and has correct values
```bash
cat .env
```

### Issue: "Port 5000 already in use"
**Solution:** Change port in `.env` or kill existing process
```bash
# Change port in .env
PORT=5001

# Or kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Issue: "No data available from ThingSpeak"
**Solution:** 
- Verify ThingSpeak credentials are correct
- Check your ThingSpeak channel has data
- Test ThingSpeak API directly in browser:
  ```
  https://api.thingspeak.com/channels/YOUR_CHANNEL_ID/feeds.json?api_key=YOUR_API_KEY&results=1
  ```

---

## 📁 File Structure

```
backend/
├── server.js                    ✅ Express server
├── routes/
│   └── dataRoutes.js           ✅ API routes
├── controllers/
│   └── dataController.js       ✅ Request handlers
├── services/
│   └── thingSpeakService.js    ✅ ThingSpeak integration
├── .env                        ⚠️  Add your credentials
├── .env.example                ✅ Template
├── package.json                ✅ Dependencies
└── test-api.js                 ✅ Test script
```

---

## 🎯 Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server (auto-reload)
npm run dev

# Start production server
npm start

# Run tests
npm test

# Check if server is running
curl http://localhost:5000/api/data/health
```

---

## 🔄 Data Flow

```
ESP32 Device
    ↓
    ↓ (sends data)
    ↓
ThingSpeak Cloud
    ↓
    ↓ (Backend fetches via API)
    ↓
Backend Server (http://localhost:5000)
    ↓
    ↓ (Frontend requests data)
    ↓
Frontend Application (http://localhost:5173)
```

---

## 📝 API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/data/health` | GET | Health check |
| `/api/data/latest` | GET | Latest sensor reading |
| `/api/data/history` | GET | Historical data (query: count) |
| `/api/data/channel-info` | GET | Channel metadata |

---

## 🎉 Success!

If you see the server startup message and can access the health check endpoint, your backend is running successfully!

**Next Steps:**
1. ✅ Backend is running
2. ✅ Test all endpoints
3. 🔄 Update frontend to use backend API
4. 🔄 Test full integration

---

**Your backend is ready to serve data! 🚀**
