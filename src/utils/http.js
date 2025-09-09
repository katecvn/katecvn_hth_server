/**
 * Module that provides HTTP response utilities.
 * This module exports an instance of the `Http` class, which contains methods to handle JSON-based HTTP responses.
 * @module http
 */

const { STATUS_CODE } = require('../constants') // Import predefined status codes from constants

/**
 * Class representing HTTP utility methods.
 */
class Http {
  /**
   * Sends a JSON response with a specified status, message, and optional data.
   *
   * @param {Object} res - The Express.js response object.
   * @param {string} message - The message to include in the JSON response.
   * @param {number} [status=STATUS_CODE.OK] - The HTTP status code. Defaults to `STATUS_CODE.OK`.
   * @param {Object|null} [data=null] - Additional data to include in the response (optional).
   * @returns {Object} The JSON response object.
   *
   * @example
   * const express = require('express');
   * const app = express();
   * const http = require('./http');
   *
   * app.get('/', (req, res) => {
   *   http.json(res, 'Request successful', STATUS_CODE.OK, { user: 'John Doe' });
   * });
   */
  json(res, message, status = STATUS_CODE.OK, data = null) {
    return res.status(status).json({ status, message, data })
  }
}

// Create and export an instance of the `Http` class
const http = new Http()
module.exports = http
