import { render, screen, fireEvent } from '@testing-library/react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

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

describe('Layout Component', () => {
  const mockRouter = {
    pathname: '/dashboard',
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue(mockRouter);
  });

  describe('when user is not authenticated', () => {
    it('should render children without navigation', () => {
      useSession.mockReturnValue({ data: null, status: 'unauthenticated' });

      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.queryByText('PrepWise AI')).not.toBeInTheDocument();
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });
  });

  describe('when user is authenticated', () => {
    const mockSession = {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://example.com/avatar.jpg',
      },
    };

    beforeEach(() => {
      useSession.mockReturnValue({ data: mockSession, status: 'authenticated' });
    });

    it('should render navigation with all menu items', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      expect(screen.getByText('PrepWise AI')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Mock Interview')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should highlight active navigation item', () => {
      useRouter.mockReturnValue({ ...mockRouter, pathname: '/dashboard' });

      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveClass('border-primary-500');
    });

    it('should render user avatar and name', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const avatar = screen.getByAltText('John Doe');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should call signOut when sign out button is clicked', () => {
      const mockSignOut = jest.fn();
      signOut.mockImplementation(mockSignOut);

      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const signOutButton = screen.getByText('Sign out');
      fireEvent.click(signOutButton);

      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    it('should render footer with copyright', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      expect(screen.getByText(/© 2026 PrepWise AI/)).toBeInTheDocument();
    });

    it('should render children content', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('navigation links', () => {
    const mockSession = {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://example.com/avatar.jpg',
      },
    };

    beforeEach(() => {
      useSession.mockReturnValue({ data: mockSession, status: 'authenticated' });
    });

    it('should have correct href for Home', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should have correct href for Dashboard', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });

    it('should have correct href for Mock Interview', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const mockInterviewLink = screen.getByText('Mock Interview').closest('a');
      expect(mockInterviewLink).toHaveAttribute('href', '/mock-interview');
    });

    it('should have correct href for Settings', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const settingsLink = screen.getByText('Settings').closest('a');
      expect(settingsLink).toHaveAttribute('href', '/settings');
    });
  });
});
