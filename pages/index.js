import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import {
  SparklesIcon,
  ChartBarIcon,
  CalendarIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (session) {
    return null;
  }

  const features = [
    {
      name: 'Mock Interviews',
      description: 'Practice technical and behavioral interviews with AI-powered feedback.',
      icon: SparklesIcon,
    },
    {
      name: 'Progress Tracking',
      description: 'Monitor your improvement over time with detailed analytics.',
      icon: ChartBarIcon,
    },
    {
      name: 'Calendar Integration',
      description: 'Sync with Google Calendar to prepare for upcoming interviews.',
      icon: CalendarIcon,
    },
    {
      name: 'Smart Practice',
      description: 'Get contextual questions from Glassdoor and Reddit sources.',
      icon: AcademicCapIcon,
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                    <span className="block">Ace Your Next</span>
                    <span className="block text-primary-200">Interview with AI</span>
                  </h1>
                  <p className="mt-3 text-base text-primary-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    PrepWise AI helps you prepare for interviews through AI-powered mock interviews,
                    personalized feedback, and intelligent practice questions tailored to your goals.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <button
                        onClick={() => signIn('google')}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                      >
                        Get Started with Google
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
                Features
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to succeed
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Comprehensive interview preparation tools powered by artificial intelligence.
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.name} className="relative">
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                        {feature.name}
                      </p>
                      <p className="mt-2 ml-16 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-700">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to start preparing?</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-primary-200">
              Join thousands of candidates who have improved their interview skills with PrepWise AI.
            </p>
            <button
              onClick={() => signIn('google')}
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto transition-colors duration-200"
            >
              Sign up for free
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}