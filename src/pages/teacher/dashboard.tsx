/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { LogOut, List, User, CheckCircle, Clock, XCircle } from "lucide-react";

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

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "teacher") {
      router.push("/");
      return;
    }
    setUser(parsedUser);
    fetchRequests();
  }, [router]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const params = new URLSearchParams({
        action: 'updateStatus',
        requestId,
        status,
        reviewedBy: user.name
      });

      const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
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

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Teacher Portal
                </h1>
                <p className="text-sm text-gray-600">{user.name}</p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Leave Requests</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "approved"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "rejected"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <List className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No {filter !== "all" ? filter : ""} requests found
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.employeeName}
                      </h3>
                      <p className="text-sm text-gray-500">{request.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
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

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Leave Type:</strong>
                        <span className="ml-2 inline-block px-2 py-1 text-xs bg-blue-100 text-bluee-800 rounded capitalize">
                          {request.leaveType}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Start:</strong> {request.startDate}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>End:</strong> {request.endDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Submitted:</strong>{" "}
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </p>
                      {request.reviewedBy && (
                        <p className="text-sm text-gray-600">
                          <strong>Reviewed By:</strong> {request.reviewedBy}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Reason:</strong>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {request.reason}
                    </p>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleStatusUpdate(request.id, "approved")
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(request.id, "rejected")
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
