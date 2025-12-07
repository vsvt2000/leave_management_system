import { useState } from "react";
import { useRouter } from "next/router";
import { LogIn, User, GraduationCap, BookOpen } from "lucide-react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzaNkTNJzJnkWV6Z_lQzx8swcxZ0veiWwY6hOOU6gG9DI5wr9-sLySNC4CzyDPHNxGcmg/exec";
export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use JSONP technique for Google Apps Script
      const params = new URLSearchParams({
        action: 'login',
        username,
        password,
        role
      });

      const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on role
        if (role === 'student') {
          router.push('/student/dashboard');
        } else {
          router.push('/teacher/dashboard');
        }
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your Script URL and try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Leave Management System
          </h1>
          <p className="text-blue-600">Please login to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-blue-700 mb-3">
            Login as:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-4 rounded-lg border-2 transition-all ${
                role === 'student'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <GraduationCap className={`w-8 h-8 mx-auto mb-2 ${
                role === 'student' ? 'text-indigo-600' : 'text-blue-400'
              }`} />
              <div className={`font-medium ${
                role === 'student' ? 'text-indigo-900' : 'text-blue-700'
              }`}>
                Student
              </div>
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`p-4 rounded-lg border-2 transition-all ${
                role === 'teacher'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <User className={`w-8 h-8 mx-auto mb-2 ${
                role === 'teacher' ? 'text-indigo-600' : 'text-blue-400'
              }`} />
              <div className={`font-medium ${
                role === 'teacher' ? 'text-indigo-900' : 'text-blue-700'
              }`}>
                Teacher
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={role === 'student' ? 'student1' : 'teacher1'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        
      </div>
    </div>
  );
}
