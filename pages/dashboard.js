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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

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
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: TrophyIcon,
      change: '+5.4%',
      changeType: 'positive',
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
      change: '+2.5h',
      changeType: 'positive',
    },
  ];

  const recentActivities = [
    {
      type: 'Mock Interview',
      title: 'Technical Interview - Software Engineer',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      score: 85,
    },
    {
      type: 'Calendar Sync',
      title: 'Synced 3 upcoming interviews',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      score: null,
    },
  ];

  const upcomingInterviews = [
    {
      company: 'Example Tech Corp',
      position: 'Senior Software Engineer',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00 AM',
    },
  ];

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
                {upcomingInterviews.length === 0 ? (
                  <div className="text-center py-6">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No upcoming interviews found in your calendar.
                    </p>
                    <button className="mt-4 btn-secondary">
                      Sync Calendar
                    </button>
                  </div>
                ) : (
                  upcomingInterviews.map((interview, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-primary-500 pl-4 py-2"
                    >
                      <p className="text-sm font-semibold text-gray-900">
                        {interview.company}
                      </p>
                      <p className="text-sm text-gray-600">{interview.position}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {interview.date} at {interview.time}
                      </p>
                      <button className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Prepare Now →
                      </button>
                    </div>
                  ))
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
