# 📚 Backend Documentation Index

Welcome to the AirBloom Tracker backend documentation! This index will help you navigate all available resources.

---

## 🚀 Getting Started

### For First-Time Setup
1. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** ⚡
   - Step-by-step installation
   - Environment configuration
   - Testing instructions
   - Troubleshooting

2. **[README.md](./README.md)** 📖
   - Project overview
   - Quick start
   - API endpoints
   - Dependencies

---

## 📡 API Reference

### Complete API Documentation
**[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** 📋
- All endpoints detailed
- Request/response examples
- Error codes
- Integration examples
- Testing methods

### Quick Reference

| Endpoint | Purpose | Documentation |
|----------|---------|---------------|
| `GET /api/data/health` | Health check | [API Docs](./API_DOCUMENTATION.md#2-health-check) |
| `GET /api/data/latest` | Latest reading | [API Docs](./API_DOCUMENTATION.md#3-get-latest-reading) |
| `GET /api/data/history` | Historical data | [API Docs](./API_DOCUMENTATION.md#4-get-historical-data) |
| `GET /api/data/channel-info` | Channel info | [API Docs](./API_DOCUMENTATION.md#5-get-channel-information) |

---

## 📁 Project Files

### Core Files
```
backend/
├── server.js                    # Main Express server
├── routes/dataRoutes.js        # API routes
├── controllers/dataController.js # Request handlers
├── services/thingSpeakService.js # ThingSpeak integration
├── package.json                 # Dependencies
└── .env                        # Environment variables
```

### Documentation Files
```
backend/
├── README.md                   # Main documentation
├── SETUP_GUIDE.md             # Setup instructions
├── API_DOCUMENTATION.md       # API reference
├── BACKEND_SUMMARY.md         # Implementation summary
└── INDEX.md                   # This file
```

### Testing & Tools
```
backend/
├── test-api.js                # Automated test script
└── postman_collection.json    # Postman collection
```

---

## 🎯 Quick Navigation

### By Task

#### I want to...

**Set up the backend for the first time**
→ [SETUP_GUIDE.md](./SETUP_GUIDE.md)

**Understand the API endpoints**
→ [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

**See what was implemented**
→ [BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md)

**Test the API**
→ Run `npm test` or see [SETUP_GUIDE.md#testing](./SETUP_GUIDE.md#testing)

**Deploy to production**
→ [README.md#deployment](./README.md#deployment)

**Troubleshoot issues**
→ [SETUP_GUIDE.md#troubleshooting](./SETUP_GUIDE.md#common-issues--solutions)

**Integrate with frontend**
→ [BACKEND_SUMMARY.md#frontend-integration](./BACKEND_SUMMARY.md#frontend-integration)

---

## 📖 Reading Order

### Recommended Path

#### For Developers
1. **README.md** - Project overview
2. **SETUP_GUIDE.md** - Get it running
3. **API_DOCUMENTATION.md** - Learn the API
4. **BACKEND_SUMMARY.md** - Implementation details

#### For Quick Setup
1. **SETUP_GUIDE.md** - Follow step-by-step
2. Run `npm test` - Verify it works
3. **API_DOCUMENTATION.md** - Reference as needed

#### For Integration
1. **API_DOCUMENTATION.md** - Understand endpoints
2. **BACKEND_SUMMARY.md** - See integration examples
3. Test with Postman collection

---

## 🔍 Find Information By Topic

### Setup & Configuration
- **Installation**: [SETUP_GUIDE.md#step-2-install-dependencies](./SETUP_GUIDE.md)
- **Environment Variables**: [SETUP_GUIDE.md#step-4-configure-environment-variables](./SETUP_GUIDE.md)
- **ThingSpeak Credentials**: [SETUP_GUIDE.md#step-3-get-thingspeak-credentials](./SETUP_GUIDE.md)

### API Usage
- **Endpoints Overview**: [API_DOCUMENTATION.md#endpoints-overview](./API_DOCUMENTATION.md)
- **Latest Reading**: [API_DOCUMENTATION.md#3-get-latest-reading](./API_DOCUMENTATION.md)
- **Historical Data**: [API_DOCUMENTATION.md#4-get-historical-data](./API_DOCUMENTATION.md)
- **Error Handling**: [API_DOCUMENTATION.md#error-codes](./API_DOCUMENTATION.md)

### Testing
- **Automated Tests**: Run `npm test`
- **Manual Testing**: [API_DOCUMENTATION.md#testing](./API_DOCUMENTATION.md#testing)
- **Postman Collection**: Import `postman_collection.json`

### Architecture
- **Project Structure**: [README.md#project-structure](./README.md)
- **Service Layer**: `services/thingSpeakService.js`
- **Controller Layer**: `controllers/dataController.js`
- **Routes**: `routes/dataRoutes.js`

### Deployment
- **Heroku**: [README.md#heroku](./README.md#heroku)
- **Railway**: [README.md#railway](./README.md#railway)
- **Docker**: [README.md#docker](./README.md#docker)

---

## 🧪 Testing Resources

### Automated Testing
```bash
npm test
```
Runs `test-api.js` to test all endpoints.

### Manual Testing

**Browser:**
- http://localhost:5000/api/data/health
- http://localhost:5000/api/data/latest
- http://localhost:5000/api/data/history

**cURL:**
```bash
curl http://localhost:5000/api/data/latest
```

**Postman:**
- Import `postman_collection.json`
- Set base URL to `http://localhost:5000`

---

## 📊 API Endpoints Summary

### Health Check
```
GET /api/data/health
```
Check if API is running.

### Latest Reading
```
GET /api/data/latest
```
Get most recent sensor data.

### Historical Data
```
GET /api/data/history?count=20
```
Get multiple readings (default: 20, max: 100).

### Channel Info
```
GET /api/data/channel-info
```
Get ThingSpeak channel metadata.

---

## 🔧 Configuration Files

### .env (Environment Variables)
```env
THINGSPEAK_CHANNEL_ID=your_channel_id
THINGSPEAK_READ_API_KEY=your_read_api_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### package.json (Scripts)
```bash
npm start      # Start server
npm run dev    # Start with auto-reload
npm test       # Run API tests
```

---

## 🔄 Data Flow

```
ESP32 Device
    ↓
ThingSpeak Cloud
    ↓
Backend API (Node.js)
    ↓
Frontend (React)
```

**Detailed Flow:**
1. ESP32 sends data to ThingSpeak
2. Backend fetches from ThingSpeak API
3. Backend formats and serves to frontend
4. Frontend displays to user

---

## 📝 Code Examples

### Fetch Latest Reading (JavaScript)
```javascript
const response = await fetch('http://localhost:5001/api/data/latest');
const data = await response.json();

if (data.success) {
  console.log('Temperature:', data.data.temperature);
  console.log('AQI:', data.data.aqi);
}
```

### Fetch History (JavaScript)
```javascript
const response = await fetch('http://localhost:5001/api/data/history?count=10');
const data = await response.json();

if (data.success) {
  data.data.forEach(reading => {
    console.log(reading.timestamp, reading.aqi);
  });
}
```

---

## 🐛 Troubleshooting

### Common Issues

**Server won't start**
→ [SETUP_GUIDE.md#issue-1](./SETUP_GUIDE.md#issue-1-cannot-find-module-express)

**No data from ThingSpeak**
→ [SETUP_GUIDE.md#issue-4](./SETUP_GUIDE.md#issue-4-no-response-from-thingspeak-api)

**CORS errors**
→ [SETUP_GUIDE.md#issue-5](./SETUP_GUIDE.md#issue-5-cors-errors-from-frontend)

**Port already in use**
→ [SETUP_GUIDE.md#issue-3](./SETUP_GUIDE.md#issue-3-port-5000-already-in-use)

---

## 📚 Additional Resources

### External Documentation
- [ThingSpeak API](https://www.mathworks.com/help/thingspeak/rest-api.html)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/docs/)
- [Axios](https://axios-http.com/docs/intro)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [Nodemon](https://nodemon.io/) - Auto-reload
- [cURL](https://curl.se/) - Command-line testing

---

## ✅ Quick Checklist

### Setup
- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] ThingSpeak credentials added
- [ ] Server starts successfully

### Testing
- [ ] Health check works
- [ ] Latest endpoint returns data
- [ ] History endpoint returns data
- [ ] No errors in console
- [ ] Automated tests pass

### Integration
- [ ] Frontend can connect
- [ ] CORS configured correctly
- [ ] Data format matches frontend
- [ ] Real-time updates working

---

## 🎯 Success Criteria

Your backend is ready when:
- ✅ Server starts without errors
- ✅ All endpoints return data
- ✅ Tests pass (`npm test`)
- ✅ No CORS errors
- ✅ Frontend can fetch data

---

## 📞 Getting Help

### Documentation Priority
1. **SETUP_GUIDE.md** - Setup issues
2. **API_DOCUMENTATION.md** - API questions
3. **README.md** - General info
4. **BACKEND_SUMMARY.md** - Implementation details

### Debugging Steps
1. Check console logs
2. Verify `.env` configuration
3. Test ThingSpeak API directly
4. Run automated tests
5. Check network connectivity

---

## 🎉 You're Ready!

All documentation is available and organized. Start with:

1. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Get running
2. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Learn the API
3. **Test**: `npm test`

---

**Happy coding! 🚀**

---

© 2026 AirBloom Tracker Backend
