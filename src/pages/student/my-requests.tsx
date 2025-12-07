/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzaNkTNJzJnkWV6Z_lQzx8swcxZ0veiWwY6hOOU6gG9DI5wr9-sLySNC4CzyDPHNxGcmg/exec";
interface LeaveRequest {
  id: string;
  employeeName: string;
  email: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  reviewedBy: string;
  submittedAt: string;
}

export default function MyRequestsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchRequests(parsedUser.email);
  }, [router]);

  const fetchRequests = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      // Filter requests for this student only
      const myRequests = (data.requests || []).filter(
        (req: LeaveRequest) => req.email === email
      );
      setRequests(myRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
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
                My Leave Requests
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-blue-600">Loading your requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-blue-600 mb-4">
                You haven&apos;t submitted any leave requests yet
              </p>
              <Link href="/student/request">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Submit Your First Request
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">
                        {request.leaveType.charAt(0).toUpperCase() +
                          request.leaveType.slice(1)}{" "}
                        Leave
                      </h3>
                      <p className="text-sm text-blue-500">
                        Request ID: {request.id}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusIcon(request.status)}
                      {request.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-blue-600">
                        <strong>Start Date:</strong> {request.startDate}
                      </p>
                      <p className="text-sm text-blue-600">
                        <strong>End Date:</strong> {request.endDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">
                        <strong>Submitted:</strong>{" "}
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </p>
                      {request.reviewedBy && (
                        <p className="text-sm text-blue-600">
                          <strong>Reviewed By:</strong> {request.reviewedBy}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-blue-700">
                      <strong>Reason:</strong>
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      {request.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
