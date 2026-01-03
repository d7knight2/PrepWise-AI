/**
 * Utility functions for calendar event processing
 */

/**
 * Identifies if an event is likely an interview based on title and description
 * @param {string} title - Event title
 * @param {string} description - Event description
 * @returns {boolean} - True if event appears to be an interview
 */
export function isInterviewEvent(title, description = '') {
  const interviewKeywords = [
    'interview',
    'screening',
    'technical',
    'behavioral',
    'onsite',
    'phone screen',
    'video call',
    'meet with',
    'chat with',
    'discussion with',
    'hiring',
    'recruitment',
    'candidate',
  ];

  const combinedText = `${title} ${description}`.toLowerCase();
  return interviewKeywords.some(keyword => combinedText.includes(keyword));
}

/**
 * Extracts interview details from event data
 * @param {Object} event - Google Calendar event
 * @returns {Object} - Structured interview data
 */
export function parseInterviewEvent(event) {
  const title = event.summary || 'Untitled Interview';
  const description = event.description || '';
  
  // Try to extract company and position from title or description
  let company = 'Company';
  let position = 'Position';
  
  // Common patterns: "Interview with [Company]", "[Company] Interview", etc.
  const companyMatch = title.match(/(?:with|at|@)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+-|\s+\||\s+for|$)/i);
  if (companyMatch) {
    company = companyMatch[1].trim();
  }
  
  // Try to extract position
  const positionMatch = title.match(/(?:for|position:|role:)\s+([A-Za-z\s]+?)(?:\s+-|\s+\||\s+at|$)/i) ||
                       description.match(/(?:position:|role:)\s+([A-Za-z\s]+?)(?:\n|$)/i);
  if (positionMatch) {
    position = positionMatch[1].trim();
  }

  const startTime = event.start?.dateTime || event.start?.date;
  const endTime = event.end?.dateTime || event.end?.date;
  
  return {
    id: event.id,
    title,
    company,
    position,
    startTime,
    endTime,
    description,
    location: event.location || '',
    meetingLink: event.hangoutLink || '',
  };
}
