import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Settings from '@/pages/settings';

// Mock next-auth
jest.mock('next-auth/react');

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Layout component
jest.mock('@/components/Layout', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

describe('Settings Page', () => {
  const mockPush = jest.fn();
  const mockSession = {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://example.com/avatar.jpg',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({
      push: mockPush,
    });
    global.alert = jest.fn();
  });

  describe('when user is not authenticated', () => {
    it('should redirect to home', () => {
      useSession.mockReturnValue({ data: null, status: 'unauthenticated' });

      render(<Settings />);

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('when loading', () => {
    it('should show loading spinner', () => {
      useSession.mockReturnValue({ data: null, status: 'loading' });

      const { container } = render(<Settings />);

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      useSession.mockReturnValue({ data: mockSession, status: 'authenticated' });
    });

    it('should render page title and description', () => {
      render(<Settings />);

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText(/Manage your account preferences/)).toBeInTheDocument();
    });

    describe('Profile section', () => {
      it('should render profile section header', () => {
        render(<Settings />);

        expect(screen.getByText('Profile')).toBeInTheDocument();
      });

      it('should display user information', () => {
        render(<Settings />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
      });

      it('should render user avatar', () => {
        render(<Settings />);

        const avatar = screen.getByAltText('John Doe');
        expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      });

      it('should render target role input', () => {
        render(<Settings />);

        const input = screen.getByPlaceholderText(/Software Engineer, Product Manager/);
        expect(input).toBeInTheDocument();
      });

      it('should render years of experience dropdown', () => {
        render(<Settings />);

        expect(screen.getByText('Years of Experience')).toBeInTheDocument();
        const select = screen.getByText('Years of Experience').closest('div').querySelector('select');
        expect(select).toBeInTheDocument();
      });
    });

    describe('Notifications section', () => {
      it('should render notifications section header', () => {
        render(<Settings />);

        expect(screen.getByText('Notifications')).toBeInTheDocument();
      });

      it('should have email notifications enabled by default', () => {
        const { container } = render(<Settings />);

        const toggles = container.querySelectorAll('input[type="checkbox"]');
        expect(toggles[0]).toBeChecked();
      });

      it('should have practice reminders disabled by default', () => {
        const { container } = render(<Settings />);

        const toggles = container.querySelectorAll('input[type="checkbox"]');
        expect(toggles[1]).not.toBeChecked();
      });

      it('should toggle email notifications', () => {
        const { container } = render(<Settings />);

        const toggle = container.querySelectorAll('input[type="checkbox"]')[0];
        expect(toggle).toBeChecked();

        fireEvent.click(toggle);
        expect(toggle).not.toBeChecked();

        fireEvent.click(toggle);
        expect(toggle).toBeChecked();
      });

      it('should toggle practice reminders', () => {
        const { container } = render(<Settings />);

        const toggle = container.querySelectorAll('input[type="checkbox"]')[1];
        expect(toggle).not.toBeChecked();

        fireEvent.click(toggle);
        expect(toggle).toBeChecked();
      });
    });

    describe('Calendar Integration section', () => {
      it('should render calendar integration section header', () => {
        render(<Settings />);

        expect(screen.getByText('Calendar Integration')).toBeInTheDocument();
      });

      it('should have calendar sync disabled by default', () => {
        const { container } = render(<Settings />);

        const toggles = container.querySelectorAll('input[type="checkbox"]');
        expect(toggles[2]).not.toBeChecked();
      });

      it('should show alert when enabling calendar sync', () => {
        const { container } = render(<Settings />);

        const toggle = container.querySelectorAll('input[type="checkbox"]')[2];
        fireEvent.click(toggle);

        expect(global.alert).toHaveBeenCalledWith(
          expect.stringContaining('Calendar sync enabled')
        );
      });

      it('should show success message when calendar sync is enabled', () => {
        const { container } = render(<Settings />);

        const toggle = container.querySelectorAll('input[type="checkbox"]')[2];
        fireEvent.click(toggle);

        expect(screen.getByText(/Calendar sync is active/)).toBeInTheDocument();
      });

      it('should hide success message when calendar sync is disabled', () => {
        const { container } = render(<Settings />);

        const toggle = container.querySelectorAll('input[type="checkbox"]')[2];
        
        // Enable
        fireEvent.click(toggle);
        expect(screen.getByText(/Calendar sync is active/)).toBeInTheDocument();

        // Disable
        fireEvent.click(toggle);
        expect(screen.queryByText(/Calendar sync is active/)).not.toBeInTheDocument();
      });
    });

    describe('Privacy & Data section', () => {
      it('should render privacy section header', () => {
        render(<Settings />);

        expect(screen.getByText('Privacy & Data')).toBeInTheDocument();
      });

      it('should have data sharing disabled by default', () => {
        const { container } = render(<Settings />);

        const toggles = container.querySelectorAll('input[type="checkbox"]');
        expect(toggles[3]).not.toBeChecked();
      });

      it('should toggle data sharing', () => {
        const { container } = render(<Settings />);

        const toggle = container.querySelectorAll('input[type="checkbox"]')[3];
        expect(toggle).not.toBeChecked();

        fireEvent.click(toggle);
        expect(toggle).toBeChecked();
      });

      it('should render delete account button', () => {
        render(<Settings />);

        expect(screen.getByText('Delete Account')).toBeInTheDocument();
      });
    });

    describe('Save settings', () => {
      it('should render save button', () => {
        render(<Settings />);

        expect(screen.getByText('Save Settings')).toBeInTheDocument();
      });

      it('should show success alert when save button is clicked', () => {
        render(<Settings />);

        const saveButton = screen.getByText('Save Settings');
        fireEvent.click(saveButton);

        expect(global.alert).toHaveBeenCalledWith('Settings saved successfully!');
      });
    });
  });
});
