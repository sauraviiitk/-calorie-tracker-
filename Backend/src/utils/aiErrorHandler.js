// Centralized utility to format AI errors for users
function formatAiError(error) {
  let errMsg = error?.message || (typeof error === 'string' ? error : 'An unknown error occurred.');
  
  try {
    if (typeof errMsg === 'string' && errMsg.trim().startsWith('{')) {
      const parsed = JSON.parse(errMsg);
      if (parsed.error) {
        if (parsed.error.code === 429 || parsed.error.status === 'RESOURCE_EXHAUSTED' || parsed.error.message?.includes('Quota exceeded')) {
          return "AI quota exceeded. We're currently experiencing high traffic. Please try again in a few minutes.";
        }
        return parsed.error.message || 'AI encountered an error.';
      }
    }
  } catch (e) {
    // Not valid JSON, continue
  }
  
  if (typeof errMsg === 'string' && (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('Quota exceeded'))) {
    return "AI quota exceeded. We're currently experiencing high traffic. Please try again in a few minutes.";
  }

  return errMsg || 'Sorry, something went wrong. Please try again.';
}

module.exports = { formatAiError };
