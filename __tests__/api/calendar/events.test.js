import { isInterviewEvent, parseInterviewEvent } from '../../../utils/calendarHelpers';

describe('Calendar Events API - Helper Functions', () => {
  describe('isInterviewEvent', () => {
    it('should identify interview events by title', () => {
      expect(isInterviewEvent('Technical Interview with Google')).toBe(true);
      expect(isInterviewEvent('Phone Screen - Software Engineer')).toBe(true);
      expect(isInterviewEvent('Behavioral Interview Round 2')).toBe(true);
      expect(isInterviewEvent('Onsite Interview')).toBe(true);
    });

    it('should identify interview events by description', () => {
      expect(isInterviewEvent('Meeting', 'This is a technical interview')).toBe(true);
      expect(isInterviewEvent('Call', 'Screening call with hiring manager')).toBe(true);
    });

    it('should identify various interview keywords', () => {
      expect(isInterviewEvent('Video call with tech lead')).toBe(true);
      expect(isInterviewEvent('Discussion with hiring team')).toBe(true);
      expect(isInterviewEvent('Meet with recruiter')).toBe(true);
      expect(isInterviewEvent('Recruitment chat')).toBe(true);
      expect(isInterviewEvent('Candidate screening')).toBe(true);
    });

    it('should not identify non-interview events', () => {
      expect(isInterviewEvent('Team Meeting')).toBe(false);
      expect(isInterviewEvent('Lunch with Friends')).toBe(false);
      expect(isInterviewEvent('Doctor Appointment')).toBe(false);
      expect(isInterviewEvent('Project Sync')).toBe(false);
    });

    it('should handle case-insensitive matching', () => {
      expect(isInterviewEvent('INTERVIEW WITH COMPANY')).toBe(true);
      expect(isInterviewEvent('Interview With Company')).toBe(true);
      expect(isInterviewEvent('interview with company')).toBe(true);
    });

    it('should handle empty or undefined inputs', () => {
      expect(isInterviewEvent('')).toBe(false);
      expect(isInterviewEvent('', '')).toBe(false);
      expect(isInterviewEvent('Meeting', undefined)).toBe(false);
    });
  });

  describe('parseInterviewEvent', () => {
    it('should parse basic event structure', () => {
      const event = {
        id: 'event123',
        summary: 'Technical Interview with Google',
        description: 'Interview for Software Engineer position',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' },
        location: 'Virtual',
        hangoutLink: 'https://meet.google.com/abc-defg-hij',
      };

      const result = parseInterviewEvent(event);

      expect(result.id).toBe('event123');
      expect(result.title).toBe('Technical Interview with Google');
      expect(result.startTime).toBe('2024-01-15T10:00:00Z');
      expect(result.endTime).toBe('2024-01-15T11:00:00Z');
      expect(result.location).toBe('Virtual');
      expect(result.meetingLink).toBe('https://meet.google.com/abc-defg-hij');
    });

    it('should extract company from title patterns', () => {
      const patterns = [
        { title: 'Interview with Google', expected: 'Google' },
        { title: 'Technical Interview at Microsoft', expected: 'Microsoft' },
        { title: 'Interview @ Amazon', expected: 'Amazon' },
        { title: 'Facebook Interview', expected: 'Company' },
      ];

      patterns.forEach(({ title, expected }) => {
        const result = parseInterviewEvent({
          id: '1',
          summary: title,
          start: { dateTime: '2024-01-15T10:00:00Z' },
          end: { dateTime: '2024-01-15T11:00:00Z' },
        });
        expect(result.company).toBe(expected);
      });
    });

    it('should extract position from title patterns', () => {
      const patterns = [
        { title: 'Interview for Software Engineer', expected: 'Software Engineer' },
        { title: 'Technical Interview - Position: Senior Developer', expected: 'Senior Developer' },
        { title: 'Interview Role: Product Manager', expected: 'Product Manager' },
      ];

      patterns.forEach(({ title, expected }) => {
        const result = parseInterviewEvent({
          id: '1',
          summary: title,
          start: { dateTime: '2024-01-15T10:00:00Z' },
          end: { dateTime: '2024-01-15T11:00:00Z' },
        });
        expect(result.position).toBe(expected);
      });
    });

    it('should handle events without optional fields', () => {
      const event = {
        id: 'event456',
        summary: 'Interview',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' },
      };

      const result = parseInterviewEvent(event);

      expect(result.id).toBe('event456');
      expect(result.title).toBe('Interview');
      expect(result.description).toBe('');
      expect(result.location).toBe('');
      expect(result.meetingLink).toBe('');
      expect(result.company).toBe('Company');
      expect(result.position).toBe('Position');
    });

    it('should handle all-day events with date instead of dateTime', () => {
      const event = {
        id: 'event789',
        summary: 'Interview Day',
        start: { date: '2024-01-15' },
        end: { date: '2024-01-15' },
      };

      const result = parseInterviewEvent(event);

      expect(result.startTime).toBe('2024-01-15');
      expect(result.endTime).toBe('2024-01-15');
    });

    it('should handle missing summary', () => {
      const event = {
        id: 'event999',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' },
      };

      const result = parseInterviewEvent(event);

      expect(result.title).toBe('Untitled Interview');
    });

    it('should extract position from description if not in title', () => {
      const event = {
        id: 'event111',
        summary: 'Interview with TechCorp',
        description: 'Position: Senior Backend Engineer\nDetails about the role...',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' },
      };

      const result = parseInterviewEvent(event);

      expect(result.position).toBe('Senior Backend Engineer');
    });
  });

  describe('Date filtering logic', () => {
    it('should correctly calculate 6 months ago date', () => {
      const now = new Date('2024-06-15T00:00:00Z');
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      expect(sixMonthsAgo.getMonth()).toBe(11); // December (0-indexed)
      expect(sixMonthsAgo.getFullYear()).toBe(2023);
    });

    it('should identify past vs upcoming interviews', () => {
      const now = new Date('2024-06-15T12:00:00Z');
      const pastDate = new Date('2024-06-14T10:00:00Z');
      const futureDate = new Date('2024-06-16T10:00:00Z');

      expect(pastDate < now).toBe(true);
      expect(futureDate > now).toBe(true);
    });
  });
});
