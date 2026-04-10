# 🚀 Backend Setup Guide

Complete step-by-step guide to set up and run the AirBloom backend.

## 📋 Prerequisites

- Node.js 14+ installed
- npm or yarn
- ThingSpeak account with a channel
- ThingSpeak Read API Key

## 🔧 Step-by-Step Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express (web framework)
- cors (CORS middleware)
- dotenv (environment variables)
- axios (HTTP client)
- nodemon (dev dependency)

### Step 3: Get ThingSpeak Credentials

1. **Login to ThingSpeak**: https://thingspeak.com/login
2. **Go to your channel**
3. **Find Channel ID**: 
   - Look at the URL: `https://thingspeak.com/channels/YOUR_CHANNEL_ID`
   - Or check "Channel Settings" tab
4. **Get Read API Key**:
   - Go to "API Keys" tab
   - Copy the "Read API Key"

### Step 4: Configure Environment Variables

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
THINGSPEAK_CHANNEL_ID=123456
THINGSPEAK_READ_API_KEY=ABCDEFGHIJKLMNOP
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace with your actual credentials!

### Step 5: Verify Configuration

Check that your `.env` file has:
- ✅ Valid Channel ID (numbers only)
- ✅ Valid Read API Key (16 characters)
- ✅ Port number (default: 5000)
- ✅ Frontend URL (default: http://localhost:5173)

### Step 6: Start the Server

**Development mode (recommended):**
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

### Step 7: Test the API

Open your browser and visit:

**Health Check:**
```
http://localhost:5000/api/data/health
```

Expected response:
```json
{
  "success": true,
  "message": "AirBloom Backend API is running",
  "timestamp": "2026-04-07T12:00:00.000Z",
  "environment": "development"
}
```

**Latest Reading:**
```
http://localhost:5000/api/data/latest
```

**Historical Data:**
```
http://localhost:5000/api/data/history
```

## ✅ Verification Checklist

- [ ] Node.js installed (check: `node --version`)
- [ ] Dependencies installed (check: `ls node_modules`)
- [ ] `.env` file created with credentials
- [ ] Server starts without errors
- [ ] Health check endpoint works
- [ ] Latest reading endpoint returns data
- [ ] History endpoint returns data

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find module 'express'"
**Solution:** Install dependencies
```bash
npm install
```

### Issue 2: "ThingSpeak credentials not configured"
**Solution:** Check `.env` file exists and has correct values
```bash
cat .env
```

### Issue 3: "Port 5000 already in use"
**Solution:** Change port in `.env` or kill existing process
```bash
# Change port
PORT=5001

# Or kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Issue 4: "No response from ThingSpeak API"
**Solution:** 
- Check internet connection
- Verify ThingSpeak credentials
- Test ThingSpeak API directly:
```
https://api.thingspeak.com/channels/YOUR_CHANNEL_ID/feeds.json?api_key=YOUR_API_KEY&results=1
```

### Issue 5: CORS errors from frontend
**Solution:** Verify `FRONTEND_URL` in `.env` matches your frontend URL

## 🧪 Testing with cURL

### Health Check
```bash
curl http://localhost:5000/api/data/health
```

### Latest Reading
```bash
curl http://localhost:5000/api/data/latest
```

### Historical Data (10 records)
```bash
curl http://localhost:5000/api/data/history?count=10
```

### Channel Info
```bash
curl http://localhost:5000/api/data/channel-info
```

## 📊 Expected Data Format

### Latest Reading Response
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

### History Response
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

## 🔄 Development Workflow

1. **Make changes** to code
2. **Nodemon auto-restarts** server
3. **Test endpoints** in browser
4. **Check console** for logs
5. **Repeat**

## 🚀 Next Steps

After backend is running:

1. ✅ Backend is running on port 5000
2. ✅ Test all endpoints work
3. ✅ Verify data format is correct
4. 🔄 Update frontend to use backend API
5. 🔄 Test frontend with real data

## 📝 Notes

- Keep `.env` file secure (never commit to git)
- Use `npm run dev` for development (auto-reload)
- Use `npm start` for production
- Check console logs for debugging
- ThingSpeak has rate limits (check their docs)

## 🎯 Success Criteria

Your backend is ready when:
- ✅ Server starts without errors
- ✅ Health check returns success
- ✅ Latest endpoint returns sensor data
- ✅ History endpoint returns array of data
- ✅ No CORS errors
- ✅ Console shows request logs

## 📞 Need Help?

Check:
1. Console logs for errors
2. `.env` file configuration
3. ThingSpeak channel has data
4. Internet connection
5. Port availability

---

**Your backend is now ready to serve data to the frontend! 🎉**
