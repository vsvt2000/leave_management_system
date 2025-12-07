/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Calendar } from "lucide-react";
import { leaveTypes } from "@/utils/utilities";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzaNkTNJzJnkWV6Z_lQzx8swcxZ0veiWwY6hOOU6gG9DI5wr9-sLySNC4CzyDPHNxGcmg/exec";
export default function StudentRequestPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    leaveType: 'Day Pass',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'student') {
      router.push('/');
      return;
    }
    setUser(parsedUser);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const params = new URLSearchParams({
        action: 'submit',
        employeeName: user.name||"alalala",
        email: user.email||"dhohiehc@gmailc.om",
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      });

      const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          leaveType: 'Day Pass',
          startDate: '',
          endDate: '',
          reason: ''
        });
        setTimeout(() => {
          router.push('/student/my-requests');
        }, 2000);
      } else {
        setError('Failed to submit request');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to submit request. Please check your Script URL.');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/student/dashboard"
              className="text-indigo-600 hover:text-indigo-800"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-blue-900">
                Request Leave
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Leave request submitted successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Student:</strong> {user.name}
                <br />
                <strong>Email:</strong> {user.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Leave Type *
              </label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {leaveTypes.map((leaveType) => (
                  <option key={leaveType.value} value={leaveType.title}>
                    {leaveType.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  min={formData.startDate}
                  max={
                    formData.leaveType === "Day Pass"
                      ? formData.startDate
                      : new Date(new Date(formData.startDate).getDate()+14).toLocaleString()
                  }
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Reason *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Please provide a reason for your leave request..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
