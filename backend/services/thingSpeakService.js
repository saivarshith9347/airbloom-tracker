/**
 * ThingSpeak Service
 * Handles all communication with ThingSpeak API
 * Fetches sensor data and formats it for the application
 */

const axios = require('axios');

class ThingSpeakService {
  constructor() {
    this.baseUrl = 'https://api.thingspeak.com';
    this.channelId = process.env.THINGSPEAK_CHANNEL_ID;
    this.apiKey = process.env.THINGSPEAK_READ_API_KEY;
  }

  /**
   * Validate that required environment variables are set
   */
  validateConfig() {
    if (!this.channelId || !this.apiKey) {
      throw new Error('ThingSpeak credentials not configured. Check .env file.');
    }
  }

  /**
   * Fetch data from ThingSpeak API
   * @param {number} results - Number of results to fetch (default: 20)
   * @returns {Promise<Object>} Raw ThingSpeak response
   */
  async fetchData(results = 20) {
    this.validateConfig();

    try {
      const url = `${this.baseUrl}/channels/${this.channelId}/feeds.json`;
      const response = await axios.get(url, {
        params: {
          api_key: this.apiKey,
          results: results
        },
        timeout: 10000 // 10 second timeout
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        // ThingSpeak API returned an error
        throw new Error(`ThingSpeak API error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from ThingSpeak API. Check your internet connection.');
      } else {
        // Something else went wrong
        throw new Error(`Error fetching data: ${error.message}`);
      }
    }
  }

  /**
   * Parse a single ThingSpeak feed entry into application format
   * @param {Object} feed - Single feed entry from ThingSpeak
   * @returns {Object} Formatted sensor reading
   */
  parseFeedEntry(feed) {
    return {
      temperature: parseFloat(feed.field1) || 0,
      humidity: parseFloat(feed.field2) || 0,
      aqi: parseFloat(feed.field3) || 0,
      location: {
        lat: parseFloat(feed.field4) || 0,
        lng: parseFloat(feed.field5) || 0
      },
      timestamp: feed.created_at,
      entryId: feed.entry_id
    };
  }

  /**
   * Get the latest sensor reading
   * @returns {Promise<Object>} Latest formatted sensor reading
   */
  async getLatestReading() {
    try {
      const data = await this.fetchData(1);
      
      if (!data.feeds || data.feeds.length === 0) {
        return null;
      }

      return this.parseFeedEntry(data.feeds[0]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get historical sensor readings
   * @param {number} count - Number of readings to fetch (default: 20)
   * @returns {Promise<Array>} Array of formatted sensor readings
   */
  async getHistory(count = 20) {
    try {
      const data = await this.fetchData(count);
      
      if (!data.feeds || data.feeds.length === 0) {
        return [];
      }

      return data.feeds.map(feed => this.parseFeedEntry(feed));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get channel information
   * @returns {Promise<Object>} Channel metadata
   */
  async getChannelInfo() {
    this.validateConfig();

    try {
      const url = `${this.baseUrl}/channels/${this.channelId}.json`;
      const response = await axios.get(url, {
        params: {
          api_key: this.apiKey
        },
        timeout: 10000
      });

      return {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        last_entry_id: response.data.last_entry_id
      };
    } catch (error) {
      throw new Error(`Error fetching channel info: ${error.message}`);
    }
  }
}

module.exports = new ThingSpeakService();
