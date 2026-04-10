/**
 * Data Routes
 * Defines all API endpoints for sensor data
 */

const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

/**
 * @route   GET /api/data/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', dataController.healthCheck);

/**
 * @route   GET /api/data/latest
 * @desc    Get the latest sensor reading
 * @access  Public
 */
router.get('/latest', dataController.getLatestReading);

/**
 * @route   GET /api/data/history
 * @desc    Get historical sensor readings
 * @query   count - Number of readings (optional, default: 20, max: 100)
 * @access  Public
 */
router.get('/history', dataController.getHistory);

/**
 * @route   GET /api/data/channel-info
 * @desc    Get ThingSpeak channel information
 * @access  Public
 */
router.get('/channel-info', dataController.getChannelInfo);

module.exports = router;
