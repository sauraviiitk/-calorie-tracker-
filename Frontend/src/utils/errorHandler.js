/**
 * errorHandler.js
 * Centralized utility to normalize backend errors, Axios errors, and internal exceptions
 * into a safe, human-readable format for the UI.
 */

export const normalizeApiError = (error) => {
  const normalized = {
    title: 'Something went wrong',
    message: "We couldn't complete this action. Please try again.",
    severity: 'error',
    retryable: true,
    technicalDetails: null
  };

  if (!error) return normalized;

  // Extract underlying raw error safely for the expandable technical details section
  try {
    // Check if it's an axios error and extract the response data
    if (error.response && error.response.data) {
      normalized.technicalDetails = typeof error.response.data === 'string' 
        ? error.response.data 
        : JSON.stringify(error.response.data, null, 2);
    } else {
      normalized.technicalDetails = error.message || String(error);
    }
  } catch (e) {
    normalized.technicalDetails = 'Could not stringify technical error.';
  }

  // Handle Axios HTTP errors specifically
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    // First try to extract a clear message from the API response if it's a known format
    let apiMessage = data?.message || data?.error?.message;
    
    // Sometimes the backend sends stringified JSON in the message/error fields
    try {
      if (typeof apiMessage === 'string' && apiMessage.trim().startsWith('{')) {
        const parsed = JSON.parse(apiMessage);
        if (parsed.error && parsed.error.message) {
          apiMessage = parsed.error.message;
        }
      }
    } catch (e) {
      // Ignored
    }

    // Map common HTTP statuses
    switch (status) {
      case 400:
        normalized.title = 'Invalid Request';
        normalized.message = apiMessage || 'Please check your input and try again.';
        normalized.retryable = false;
        break;
      case 401:
        normalized.title = 'Authentication Failed';
        normalized.message = apiMessage || 'Please log in again to continue.';
        normalized.retryable = false;
        break;
      case 403:
        normalized.title = 'Permission Denied';
        normalized.message = "You don't have permission to perform this action.";
        normalized.retryable = false;
        break;
      case 404:
        normalized.title = 'Not Found';
        normalized.message = 'The resource you requested could not be found.';
        normalized.retryable = false;
        break;
      case 409:
        normalized.title = 'Conflict';
        normalized.message = apiMessage || 'There was a conflict with your request. Please try again.';
        normalized.retryable = true;
        break;
      case 422:
        normalized.title = 'Invalid Input';
        normalized.message = apiMessage || 'Please check your information and try again.';
        normalized.retryable = false;
        break;
      case 429:
        normalized.title = 'Temporarily Unavailable';
        normalized.message = "We've reached the processing limit right now. Please try again shortly.";
        normalized.severity = 'warning';
        normalized.retryable = true;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        normalized.title = 'Service Unavailable';
        normalized.message = 'The server is temporarily down. Please try again later.';
        normalized.retryable = true;
        break;
      default:
        // Use the API message if available, otherwise generic
        normalized.message = apiMessage || normalized.message;
    }
  } else if (error.request) {
    // Network errors (request made but no response received)
    normalized.title = 'Network Error';
    normalized.message = 'We couldn\'t connect to the server. Check your internet connection and try again.';
    normalized.retryable = true;
  } else {
    // Something else happened (e.g. setting up the request, or a generic JS error)
    // Avoid exposing raw JS error messages like "Cannot read properties of null"
    const message = error.message || '';
    if (message.includes('timeout')) {
      normalized.title = 'Request Timeout';
      normalized.message = 'The request took too long to complete. Please try again.';
      normalized.retryable = true;
    }
  }

  // Final sanitization: If the message looks like JSON (some backend stringified errors), override it
  if (typeof normalized.message === 'string' && normalized.message.trim().startsWith('{')) {
    normalized.message = "An unexpected error occurred. Please try again later.";
  }

  return normalized;
};
