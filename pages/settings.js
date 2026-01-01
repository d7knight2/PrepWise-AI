import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [practiceReminders, setPracticeReminders] = useState(false);
  const [calendarSync, setCalendarSync] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

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

  const handleSaveSettings = () => {
    // In a real implementation, this would save to Firebase
    alert('Settings saved successfully!');
  };

  const handleCalendarSync = () => {
    setCalendarSync(!calendarSync);
    if (!calendarSync) {
      alert('Calendar sync enabled. Your Google Calendar will be monitored for interview events.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your account preferences and application settings.
            </p>
          </div>

          {/* Profile Section */}
          <div className="card mb-6">
            <div className="flex items-center mb-4">
              <UserCircleIcon className="h-6 w-6 text-gray-700 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <img
                  src={session.user?.image || '/default-avatar.png'}
                  alt={session.user?.name || 'User'}
                  className="h-16 w-16 rounded-full"
                />
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">
                    {session.user?.name}
                  </p>
                  <p className="text-sm text-gray-600">{session.user?.email}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Role
                </label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer, Product Manager"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                  <option>0-2 years</option>
                  <option>3-5 years</option>
                  <option>6-10 years</option>
                  <option>10+ years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="card mb-6">
            <div className="flex items-center mb-4">
              <BellIcon className="h-6 w-6 text-gray-700 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">
                    Receive updates about your progress and upcoming interviews
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Practice Reminders</p>
                  <p className="text-sm text-gray-600">
                    Get daily reminders to practice mock interviews
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={practiceReminders}
                    onChange={(e) => setPracticeReminders(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Calendar Integration Section */}
          <div className="card mb-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-6 w-6 text-gray-700 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Calendar Integration
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Google Calendar Sync</p>
                  <p className="text-sm text-gray-600">
                    Automatically detect upcoming interviews from your calendar
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={calendarSync}
                    onChange={handleCalendarSync}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              {calendarSync && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800">
                    ✓ Calendar sync is active. We'll notify you of upcoming interviews and
                    suggest preparation materials.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Privacy & Data Section */}
          <div className="card mb-6">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-gray-700 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Privacy & Data
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Data Sharing</p>
                  <p className="text-sm text-gray-600">
                    Share anonymized data to improve AI recommendations
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={dataSharing}
                    onChange={(e) => setDataSharing(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  Delete Account
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Permanently delete your account and all associated data
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="btn-primary"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
