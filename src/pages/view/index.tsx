import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";
import { fetchRequests } from "@/utils/utilities";

// PUT YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
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
  submittedAt: string;
}

export default function ViewPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests(setLoading, setRequests, setError, SCRIPT_URL);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-bluee900">
                View Requests
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-bluee600">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-bluee400 mx-auto mb-4" />
              <p className="text-bluee600">No leave requests found</p>
              <p className="text-sm text-bluee500 mt-2">
                Submit your first request to get started!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-bluee700">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-bluee700">
                      Employee
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-bluee700">
                      Leave Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-bluee700">
                      Duration
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-bluee700">
                      Reason
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-bluee700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-bluee600">
                        {request.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-bluee900">
                          {request.employeeName}
                        </div>
                        <div className="text-sm text-bluee500">
                          {request.email}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-bluee-800 rounded-full capitalize">
                          {request.leaveType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-bluee600">
                        {request.startDate} to {request.endDate}
                      </td>
                      <td className="py-3 px-4 text-sm text-bluee600 max-w-xs truncate">
                        {request.reason}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
