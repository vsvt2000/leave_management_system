/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { LogOut, FileText, List, User } from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "student") {
      router.push("/");
      return;
    }
    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-blue-900">
                  Student Portal
                </h1>
                <p className="text-sm text-blue-600">{user.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/student/request">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-500">
              <FileText className="w-16 h-16 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                Request Leave
              </h2>
              <p className="text-blue-600">Submit a new leave request</p>
            </div>
          </Link>

          <Link href="/student/my-requests">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-500">
              <List className="w-16 h-16 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                My Requests
              </h2>
              <p className="text-blue-600">
                View your leave requests and status
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
