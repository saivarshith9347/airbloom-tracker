# 📡 AirBloom Backend API Documentation

Complete API reference for the AirBloom Tracker backend.

## Base URL

```
http://localhost:5000
```

For production, replace with your deployed URL.

---

## 🔐 Authentication

Currently, the API is public. For production, consider adding:
- API key authentication
- JWT tokens
- Rate limiting

---

## 📋 Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/api/data/health` | Health check |
| GET | `/api/data/latest` | Latest sensor reading |
| GET | `/api/data/history` | Historical readings |
| GET | `/api/data/channel-info` | ThingSpeak channel info |

---

## 📍 Endpoint Details

### 1. Root Endpoint

Get API information and available endpoints.

**Request:**
```http
GET /
```

**Response:**
```json
{
  "message": "AirBloom Tracker Backend API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "health": "/api/data/health",
    "latest": "/api/data/latest",
    "history": "/api/data/history?count=20",
    "channelInfo": "/api/data/channel-info"
  }
}
```

**Status Codes:**
- `200` - Success

---

### 2. Health Check

Check if the API is running and responsive.

**Request:**
```http
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

**Status Codes:**
- `200` - API is healthy

**Use Case:**
- Monitoring and uptime checks
- Load balancer health checks
- Deployment verification

---

### 3. Get Latest Reading

Fetch the most recent sensor reading from ThingSpeak.

**Request:**
```http
GET /api/data/latest
```

**Response (Success):**
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

**Response (No Data):**
```json
{
  "success": false,
  "message": "No data available from ThingSpeak"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error fetching latest reading",
  "error": "ThingSpeak API error: 401 - Unauthorized"
}
```

**Status Codes:**
- `200` - Success
- `404` - No data available
- `500` - Server error

**Data Fields:**
| Field | Type | Description | Unit |
|-------|------|-------------|------|
| temperature | number | Air temperature | °C |
| humidity | number | Relative humidity | % |
| aqi | number | Air Quality Index | - |
| location.lat | number | Latitude | degrees |
| location.lng | number | Longitude | degrees |
| timestamp | string | ISO 8601 timestamp | - |
| entryId | number | ThingSpeak entry ID | - |

**Example cURL:**
```bash
curl http://localhost:5000/api/data/latest
```

**Example JavaScript:**
```javascript
fetch('http://localhost:5000/api/data/latest')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### 4. Get Historical Data

Fetch multiple historical sensor readings.

**Request:**
```http
GET /api/data/history?count=20
```

**Query Parameters:**
| Parameter | Type | Required | Default | Max | Description |
|-----------|------|----------|---------|-----|-------------|
| count | number | No | 20 | 100 | Number of readings to fetch |

**Response (Success):**
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
    {
      "temperature": 24.3,
      "humidity": 65.5,
      "aqi": 83,
      "location": {
        "lat": 28.6140,
        "lng": 77.2091
      },
      "timestamp": "2026-04-07T11:59:45Z",
      "entryId": 12344
    }
    // ... more readings
  ]
}
```

**Response (No Data):**
```json
{
  "success": false,
  "message": "No historical data available"
}
```

**Status Codes:**
- `200` - Success
- `404` - No data available
- `500` - Server error

**Example Requests:**

Get last 10 readings:
```bash
curl http://localhost:5000/api/data/history?count=10
```

Get last 50 readings:
```bash
curl http://localhost:5000/api/data/history?count=50
```

Get default (20 readings):
```bash
curl http://localhost:5000/api/data/history
```

**Example JavaScript:**
```javascript
async function getHistory(count = 20) {
  const response = await fetch(`http://localhost:5000/api/data/history?count=${count}`);
  const data = await response.json();
  return data;
}
```

---

### 5. Get Channel Information

Fetch ThingSpeak channel metadata.

**Request:**
```http
GET /api/data/channel-info
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 123456,
    "name": "AirBloom Sensor",
    "description": "Air quality monitoring station",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-04-07T12:00:00Z",
    "last_entry_id": 12345
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error fetching channel information",
  "error": "ThingSpeak API error: 404 - Not Found"
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

**Example cURL:**
```bash
curl http://localhost:5000/api/data/channel-info
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
    ↓ (API request)
    ↓
Backend Server
    ↓
    ↓ (formatted data)
    ↓
Frontend Application
```

---

## 📊 Response Format

All endpoints follow a consistent response format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

---

## ⚠️ Error Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 200 | Success | Request completed successfully |
| 404 | Not Found | No data available, endpoint not found |
| 500 | Server Error | ThingSpeak API error, network error, configuration error |

---

## 🔒 CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (default frontend)
- Configure additional origins in `.env` file

**CORS Headers:**
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Credentials`

---

## ⏱️ Rate Limiting

**ThingSpeak Limits:**
- Free account: 3 million messages/year
- Update interval: 15 seconds minimum
- API calls: Check ThingSpeak documentation

**Recommendations:**
- Cache responses on frontend
- Implement polling with reasonable intervals
- Consider upgrading ThingSpeak plan for production

---

## 🧪 Testing

### Using Browser
Simply open the URL in your browser:
```
http://localhost:5000/api/data/latest
```

### Using cURL
```bash
# Health check
curl http://localhost:5000/api/data/health

# Latest reading
curl http://localhost:5000/api/data/latest

# History with custom count
curl http://localhost:5000/api/data/history?count=10

# Channel info
curl http://localhost:5000/api/data/channel-info
```

### Using JavaScript Fetch
```javascript
// Latest reading
fetch('http://localhost:5000/api/data/latest')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('Temperature:', data.data.temperature);
      console.log('AQI:', data.data.aqi);
    }
  });

// History
fetch('http://localhost:5000/api/data/history?count=10')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('Records:', data.count);
      data.data.forEach(reading => {
        console.log(reading.timestamp, reading.aqi);
      });
    }
  });
```

### Using Axios
```javascript
const axios = require('axios');

// Latest reading
const latest = await axios.get('http://localhost:5000/api/data/latest');
console.log(latest.data);

// History
const history = await axios.get('http://localhost:5000/api/data/history', {
  params: { count: 10 }
});
console.log(history.data);
```

---

## 🔧 Configuration

### Environment Variables

Required in `.env` file:

```env
THINGSPEAK_CHANNEL_ID=123456
THINGSPEAK_READ_API_KEY=ABCDEFGHIJKLMNOP
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## 📝 Example Integration

### React Frontend Example

```javascript
import { useState, useEffect } from 'react';

function Dashboard() {
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:5000/api/data/latest');
        const data = await response.json();
        
        if (data.success) {
          setLatest(data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 15000); // Poll every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!latest) return <div>No data available</div>;

  return (
    <div>
      <h2>Latest Reading</h2>
      <p>Temperature: {latest.temperature}°C</p>
      <p>Humidity: {latest.humidity}%</p>
      <p>AQI: {latest.aqi}</p>
    </div>
  );
}
```

---

## 🚀 Production Considerations

### Security
- [ ] Add API key authentication
- [ ] Implement rate limiting
- [ ] Use HTTPS
- [ ] Validate input parameters
- [ ] Sanitize error messages

### Performance
- [ ] Add response caching
- [ ] Implement request queuing
- [ ] Monitor API usage
- [ ] Set up logging

### Monitoring
- [ ] Health check endpoint
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring

---

## 📞 Support

For issues or questions:
1. Check server logs
2. Verify ThingSpeak credentials
3. Test ThingSpeak API directly
4. Check network connectivity

---

**API Documentation Version 1.0.0**
