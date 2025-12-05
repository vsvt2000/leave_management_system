import Link from 'next/link';
import { Calendar, FileText, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Calendar className="w-20 h-20 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Leave Management System
          </h1>
          <p className="text-xl text-gray-600">
            Manage employee leave requests efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/request">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-500">
              <FileText className="w-16 h-16 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Request Leave
              </h2>
              <p className="text-gray-600">
                Submit a new leave request with dates and reason
              </p>
            </div>
          </Link>

          <Link href="/view">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-500">
              <Users className="w-16 h-16 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                View Requests
              </h2>
              <p className="text-gray-600">
                See all leave requests and their current status
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}