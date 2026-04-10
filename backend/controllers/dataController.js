/**
 * Data Controller
 * Handles HTTP requests and responses for sensor data endpoints
 */

const thingSpeakService = require('../services/thingSpeakService');

/**
 * Get the latest sensor reading
 * GET /api/data/latest
 */
const getLatestReading = async (req, res) => {
  try {
    const reading = await thingSpeakService.getLatestReading();

    if (!reading) {
      return res.status(404).json({
        success: false,
        message: 'No data available from ThingSpeak'
      });
    }

    res.status(200).json({
      success: true,
      data: reading
    });
  } catch (error) {
    console.error('Error in getLatestReading:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest reading',
      error: error.message
    });
  }
};

/**
 * Get historical sensor readings
 * GET /api/data/history
 * Query params: count (optional, default: 20)
 */
const getHistory = async (req, res) => {
  try {
    // Get count from query params, default to 20, max 100
    const count = Math.min(parseInt(req.query.count) || 20, 100);

    const readings = await thingSpeakService.getHistory(count);

    if (readings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No historical data available'
      });
    }

    res.status(200).json({
      success: true,
      count: readings.length,
      data: readings
    });
  } catch (error) {
    console.error('Error in getHistory:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching historical data',
      error: error.message
    });
  }
};

/**
 * Get channel information
 * GET /api/data/channel-info
 */
const getChannelInfo = async (req, res) => {
  try {
    const info = await thingSpeakService.getChannelInfo();

    res.status(200).json({
      success: true,
      data: info
    });
  } catch (error) {
    console.error('Error in getChannelInfo:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching channel information',
      error: error.message
    });
  }
};

/**
 * Health check endpoint
 * GET /api/data/health
 */
const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AirBloom Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};

module.exports = {
  getLatestReading,
  getHistory,
  getChannelInfo,
  healthCheck
};
