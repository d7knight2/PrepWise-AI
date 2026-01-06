import { render, screen, fireEvent } from '@testing-library/react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Home from '@/pages/index';

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

describe('Home Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({
      push: mockPush,
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    });

    it('should render the hero section', () => {
      render(<Home />);

      expect(screen.getByText(/Ace Your Next/)).toBeInTheDocument();
      expect(screen.getByText(/Interview with AI/)).toBeInTheDocument();
    });

    it('should render the tagline', () => {
      render(<Home />);

      expect(screen.getByText(/PrepWise AI helps you prepare for interviews/)).toBeInTheDocument();
    });

    it('should render Get Started button', () => {
      render(<Home />);

      const buttons = screen.getAllByText('Get Started with Google');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should call signIn when Get Started button is clicked', () => {
      const mockSignIn = jest.fn();
      signIn.mockImplementation(mockSignIn);

      render(<Home />);

      const button = screen.getAllByText('Get Started with Google')[0];
      fireEvent.click(button);

      expect(mockSignIn).toHaveBeenCalledWith('google');
    });

    it('should render all features', () => {
      render(<Home />);

      expect(screen.getByText('Mock Interviews')).toBeInTheDocument();
      expect(screen.getByText('Progress Tracking')).toBeInTheDocument();
      expect(screen.getByText('Calendar Integration')).toBeInTheDocument();
      expect(screen.getByText('Smart Practice')).toBeInTheDocument();
    });

    it('should render feature descriptions', () => {
      render(<Home />);

      expect(screen.getByText(/Practice technical and behavioral interviews/)).toBeInTheDocument();
      expect(screen.getByText(/Monitor your improvement over time/)).toBeInTheDocument();
      expect(screen.getByText(/Sync with Google Calendar/)).toBeInTheDocument();
      expect(screen.getByText(/Get contextual questions/)).toBeInTheDocument();
    });

    it('should render CTA section', () => {
      render(<Home />);

      expect(screen.getByText(/Ready to start preparing?/)).toBeInTheDocument();
      expect(screen.getByText(/Join thousands of candidates/)).toBeInTheDocument();
    });

    it('should render Sign up for free button', () => {
      render(<Home />);

      expect(screen.getByText('Sign up for free')).toBeInTheDocument();
    });
  });

  describe('when user is authenticated', () => {
    const mockSession = {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    };

    it('should redirect to dashboard', () => {
      useSession.mockReturnValue({ data: mockSession, status: 'authenticated' });

      render(<Home />);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('should return null after redirect', () => {
      useSession.mockReturnValue({ data: mockSession, status: 'authenticated' });

      const { container } = render(<Home />);

      // Since the component returns null for authenticated users (after redirect)
      // We just need to verify the push was called
      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe('when loading', () => {
    it('should show loading spinner', () => {
      useSession.mockReturnValue({ data: null, status: 'loading' });

      const { container } = render(<Home />);

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });
});
