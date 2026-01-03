import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { isInterviewEvent, parseInterviewEvent } from '@/utils/calendarHelpers';

/**
 * API handler to fetch calendar events
 * GET /api/calendar/events
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user's session
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.accessToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Calculate date range - last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    // Fetch events from Google Calendar API
    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${sixMonthsAgo.toISOString()}&` +
      `timeMax=${now.toISOString()}&` +
      `singleEvents=true&` +
      `orderBy=startTime&` +
      `maxResults=250`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!calendarResponse.ok) {
      const errorText = await calendarResponse.text();
      console.error('Calendar API error:', errorText);
      return res.status(calendarResponse.status).json({ 
        error: 'Failed to fetch calendar events',
        details: errorText 
      });
    }

    const calendarData = await calendarResponse.json();
    const events = calendarData.items || [];

    // Filter and parse interview events
    const interviews = events
      .filter(event => {
        const title = event.summary || '';
        const description = event.description || '';
        return isInterviewEvent(title, description);
      })
      .map(parseInterviewEvent);

    // Split into past and upcoming
    const upcomingInterviews = interviews.filter(interview => 
      new Date(interview.startTime) > now
    );
    
    const pastInterviews = interviews.filter(interview => 
      new Date(interview.startTime) <= now
    );

    return res.status(200).json({
      success: true,
      upcoming: upcomingInterviews,
      past: pastInterviews,
      total: interviews.length,
    });

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
