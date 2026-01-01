import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import {
  MicrophoneIcon,
  CodeBracketIcon,
  UserGroupIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

export default function MockInterview() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');

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

  const interviewTypes = [
    {
      id: 'technical',
      name: 'Technical Interview',
      description: 'Practice coding problems, algorithms, and system design questions.',
      icon: CodeBracketIcon,
      color: 'blue',
    },
    {
      id: 'behavioral',
      name: 'Behavioral Interview',
      description: 'Work on communication skills, past experiences, and situational questions.',
      icon: UserGroupIcon,
      color: 'green',
    },
  ];

  const handleStartInterview = () => {
    if (!selectedType) {
      alert('Please select an interview type');
      return;
    }
    // In a real implementation, this would start the interview session
    alert(`Starting ${selectedType} interview at ${difficulty} difficulty level. This feature will be fully implemented with AI integration.`);
  };

  return (
    <Layout>
      <div className="min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mock Interview</h1>
            <p className="mt-2 text-sm text-gray-600">
              Choose your interview type and start practicing with AI-powered feedback.
            </p>
          </div>

          {/* Interview Type Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Interview Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interviewTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`card text-left p-6 transition-all duration-200 ${
                      isSelected
                        ? 'ring-2 ring-primary-500 border-primary-500'
                        : 'hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 p-3 rounded-lg ${
                          isSelected
                            ? 'bg-primary-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        <Icon
                          className={`h-8 w-8 ${
                            isSelected ? 'text-primary-600' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {type.name}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                          {type.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="ml-2">
                          <svg
                            className="h-6 w-6 text-primary-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Difficulty Level
            </h2>
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                      difficulty === level
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interview Settings */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Interview Settings
            </h2>
            <div className="card p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">
                      Typical interview length
                    </p>
                  </div>
                  <select className="ml-4 block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md">
                    <option>30 mins</option>
                    <option>45 mins</option>
                    <option>60 mins</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Voice Feedback</p>
                    <p className="text-sm text-gray-600">
                      Get audio feedback during interview
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Real-time Hints</p>
                    <p className="text-sm text-gray-600">
                      Show helpful hints if you get stuck
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Start Interview Button */}
          <div className="flex justify-center">
            <button
              onClick={handleStartInterview}
              disabled={!selectedType}
              className={`flex items-center px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                selectedType
                  ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <PlayIcon className="h-6 w-6 mr-2" />
              Start Mock Interview
            </button>
          </div>

          {/* Tips Section */}
          <div className="mt-12 card bg-primary-50 border-primary-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              💡 Interview Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Find a quiet space with good lighting and minimal distractions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Speak clearly and explain your thought process out loud</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Take your time to understand the question before answering</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Review the feedback after each session to improve</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
