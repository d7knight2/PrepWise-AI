import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import MockInterview from '@/pages/mock-interview';

// Mock next-auth
jest.mock('next-auth/react');

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock Layout component
jest.mock('@/components/Layout', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

describe('Mock Interview Page', () => {
  const mockPush = jest.fn();
  const mockSession = {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({
      push: mockPush,
    });
  });

  describe('when user is not authenticated', () => {
    it('should redirect to home', () => {
      useSession.mockReturnValue({ data: null, status: 'unauthenticated' });

      render(<MockInterview />);

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('when loading', () => {
    it('should show loading spinner', () => {
      useSession.mockReturnValue({ data: null, status: 'loading' });

      const { container } = render(<MockInterview />);

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      useSession.mockReturnValue({ data: mockSession, status: 'authenticated' });
      // Mock window.alert
      global.alert = jest.fn();
    });

    it('should render page title and description', () => {
      render(<MockInterview />);

      expect(screen.getByText('Mock Interview')).toBeInTheDocument();
      expect(screen.getByText(/Choose your interview type/)).toBeInTheDocument();
    });

    it('should render interview type options', () => {
      render(<MockInterview />);

      expect(screen.getByText('Technical Interview')).toBeInTheDocument();
      expect(screen.getByText('Behavioral Interview')).toBeInTheDocument();
    });

    it('should render interview type descriptions', () => {
      render(<MockInterview />);

      expect(screen.getByText(/Practice coding problems, algorithms/)).toBeInTheDocument();
      expect(screen.getByText(/Work on communication skills/)).toBeInTheDocument();
    });

    it('should select interview type when clicked', () => {
      render(<MockInterview />);

      const technicalButton = screen.getByText('Technical Interview').closest('button');
      fireEvent.click(technicalButton);

      expect(technicalButton).toHaveClass('ring-2');
      expect(technicalButton).toHaveClass('ring-primary-500');
    });

    it('should render difficulty level options', () => {
      render(<MockInterview />);

      expect(screen.getByText('Easy')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Hard')).toBeInTheDocument();
    });

    it('should select difficulty level when clicked', () => {
      render(<MockInterview />);

      const hardButton = screen.getByText('Hard');
      fireEvent.click(hardButton);

      expect(hardButton).toHaveClass('bg-primary-600');
      expect(hardButton).toHaveClass('text-white');
    });

    it('should have medium difficulty selected by default', () => {
      render(<MockInterview />);

      const mediumButton = screen.getByText('Medium');
      expect(mediumButton).toHaveClass('bg-primary-600');
    });

    it('should render interview settings section', () => {
      render(<MockInterview />);

      expect(screen.getByText('Interview Settings')).toBeInTheDocument();
      expect(screen.getByText('Duration')).toBeInTheDocument();
      expect(screen.getByText('Voice Feedback')).toBeInTheDocument();
      expect(screen.getByText('Real-time Hints')).toBeInTheDocument();
    });

    it('should have voice feedback enabled by default', () => {
      const { container } = render(<MockInterview />);

      const voiceToggle = container.querySelectorAll('input[type="checkbox"]')[0];
      expect(voiceToggle).toBeChecked();
    });

    it('should have real-time hints disabled by default', () => {
      const { container } = render(<MockInterview />);

      const hintsToggle = container.querySelectorAll('input[type="checkbox"]')[1];
      expect(hintsToggle).not.toBeChecked();
    });

    it('should render duration options', () => {
      const { container } = render(<MockInterview />);

      const select = container.querySelector('select');
      expect(select).toBeInTheDocument();
      
      const options = Array.from(select.options).map(opt => opt.textContent);
      expect(options).toContain('30 mins');
      expect(options).toContain('45 mins');
      expect(options).toContain('60 mins');
    });

    it('should disable start button when no interview type selected', () => {
      render(<MockInterview />);

      const startButton = screen.getByText('Start Mock Interview');
      expect(startButton).toBeDisabled();
    });

    it('should start interview when type is selected and button clicked', () => {
      render(<MockInterview />);

      // Select technical interview
      const technicalButton = screen.getByText('Technical Interview').closest('button');
      fireEvent.click(technicalButton);

      // Click start button
      const startButton = screen.getByText('Start Mock Interview');
      fireEvent.click(startButton);

      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining('Starting technical interview')
      );
    });

    it('should enable start button when interview type selected', () => {
      render(<MockInterview />);

      const technicalButton = screen.getByText('Technical Interview').closest('button');
      fireEvent.click(technicalButton);

      const startButton = screen.getByText('Start Mock Interview');
      expect(startButton).not.toBeDisabled();
    });

    it('should render interview tips section', () => {
      render(<MockInterview />);

      expect(screen.getByText(/💡 Interview Tips/)).toBeInTheDocument();
      expect(screen.getByText(/Find a quiet space/)).toBeInTheDocument();
      expect(screen.getByText(/Speak clearly/)).toBeInTheDocument();
      expect(screen.getByText(/Take your time/)).toBeInTheDocument();
      expect(screen.getByText(/Review the feedback/)).toBeInTheDocument();
    });

    it('should include difficulty level in start message', () => {
      render(<MockInterview />);

      // Select behavioral interview
      const behavioralButton = screen.getByText('Behavioral Interview').closest('button');
      fireEvent.click(behavioralButton);

      // Select hard difficulty
      const hardButton = screen.getByText('Hard');
      fireEvent.click(hardButton);

      // Click start
      const startButton = screen.getByText('Start Mock Interview');
      fireEvent.click(startButton);

      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining('behavioral interview at hard difficulty')
      );
    });
  });
});
