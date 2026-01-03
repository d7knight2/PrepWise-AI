import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import {
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    upcomingInterviews: 0,
    practiceTime: 0,
  });
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [pastInterviews, setPastInterviews] = useState([]);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [calendarError, setCalendarError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Fetch calendar events when user is authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      fetchCalendarEvents();
    }
  }, [status, session]);

  const fetchCalendarEvents = async () => {
    try {
      setLoadingCalendar(true);
      setCalendarError(null);
      
      const response = await fetch('/api/calendar/events');
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUpcomingInterviews(data.upcoming || []);
        setPastInterviews(data.past || []);
        
        // Update stats with calendar data
        setStats(prev => ({
          ...prev,
          upcomingInterviews: data.upcoming?.length || 0,
          totalInterviews: data.past?.length || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      setCalendarError(error.message);
    } finally {
      setLoadingCalendar(false);
    }
  };

  if (status === 'loading') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  const statCards = [
    {
      name: 'Total Mock Interviews',
      value: stats.totalInterviews,
      icon: ChartBarIcon,
      change: stats.totalInterviews > 0 ? `${stats.totalInterviews} past` : 'No past',
      changeType: 'neutral',
    },
    {
      name: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: TrophyIcon,
      change: stats.averageScore > 0 ? '+5.4%' : 'N/A',
      changeType: stats.averageScore > 0 ? 'positive' : 'neutral',
    },
    {
      name: 'Upcoming Interviews',
      value: stats.upcomingInterviews,
      icon: CalendarIcon,
      change: 'From Calendar',
      changeType: 'neutral',
    },
    {
      name: 'Practice Time',
      value: `${stats.practiceTime}h`,
      icon: ClockIcon,
      change: stats.practiceTime > 0 ? '+2.5h' : 'Start now',
      changeType: stats.practiceTime > 0 ? 'positive' : 'neutral',
    },
  ];

  // Generate recent activities from past interviews
  const recentActivities = pastInterviews
    .slice(0, 5)
    .map(interview => ({
      type: 'Calendar Interview',
      title: `${interview.company} - ${interview.position}`,
      date: new Date(interview.startTime).toISOString().split('T')[0],
      score: null,
    }));

  return (
    <Layout>
      <div className="min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.user?.name?.split(' ')[0]}!
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Track your progress and continue your interview preparation journey.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.name} className="card">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                          <div
                            className={`ml-2 flex items-baseline text-sm font-semibold ${
                              stat.changeType === 'positive'
                                ? 'text-green-600'
                                : stat.changeType === 'negative'
                                ? 'text-red-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {stat.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No recent activity. Start a mock interview to begin!
                  </p>
                ) : (
                  recentActivities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <ArrowTrendingUpIcon className="h-5 w-5 text-primary-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.type} • {activity.date}
                        </p>
                      </div>
                      {activity.score && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {activity.score}%
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upcoming Interviews
              </h2>
              <div className="space-y-4">
                {loadingCalendar ? (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading calendar events...</p>
                  </div>
                ) : calendarError ? (
                  <div className="text-center py-6">
                    <CalendarIcon className="mx-auto h-12 w-12 text-red-400" />
                    <p className="mt-2 text-sm text-red-500">
                      Failed to load calendar events
                    </p>
                    <button 
                      onClick={fetchCalendarEvents}
                      className="mt-4 btn-secondary"
                    >
                      Try Again
                    </button>
                  </div>
                ) : upcomingInterviews.length === 0 ? (
                  <div className="text-center py-6">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No upcoming interviews found in your calendar.
                    </p>
                    <button 
                      onClick={fetchCalendarEvents}
                      className="mt-4 btn-secondary"
                    >
                      Refresh Calendar
                    </button>
                  </div>
                ) : (
                  upcomingInterviews.map((interview) => {
                    const interviewDate = new Date(interview.startTime);
                    const dateStr = interviewDate.toISOString().split('T')[0];
                    const timeStr = interviewDate.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    });
                    
                    return (
                      <div
                        key={interview.id}
                        className="border-l-4 border-primary-500 pl-4 py-2"
                      >
                        <p className="text-sm font-semibold text-gray-900">
                          {interview.company}
                        </p>
                        <p className="text-sm text-gray-600">{interview.position}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {dateStr} at {timeStr}
                        </p>
                        {interview.meetingLink && (
                          <a 
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium inline-block mr-4"
                          >
                            Join Meeting →
                          </a>
                        )}
                        <button 
                          onClick={() => router.push('/mock-interview')}
                          className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Prepare Now →
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/mock-interview')}
                className="p-4 border-2 border-primary-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200 text-left"
              >
                <div className="text-2xl mb-2">🎤</div>
                <h3 className="font-semibold text-gray-900">Start Mock Interview</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Practice with AI feedback
                </p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="font-semibold text-gray-900">Study Materials</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Review questions & topics
                </p>
              </button>
              <button
                onClick={() => router.push('/settings')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 text-left"
              >
                <div className="text-2xl mb-2">⚙️</div>
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage preferences
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
