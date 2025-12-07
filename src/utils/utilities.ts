/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchRequests = async (
  setLoading: (value: boolean) => void,
  setRequests: (value: any[]) => void,
  setError: (value: string) => void,
  SCRIPT_URL: string
) => {
  setLoading(true);
  setError("");
  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();
    setRequests(data.requests || []);
  } catch (err) {
    console.error("Error fetching requests:", err);
    setError("Failed to load requests. Please check your Script URL.");
  }
  setLoading(false);
};

export const leaveTypes = [
  { title: "Day Pass", value: "day pass" },
  { title: "Home Pass", value: "home pass" },
  { title: "Emergency Pass", value: "emergency pass" },
  { title: "On Duty", value: "on duty" },
];

export const faculties = [
  "Dr. Prashobh",
  "Dr. Sathish",
  "Dr. Suresh",
  "Dr. Govind",
  "Dr. Sangeetha",
  "Dr. Balasubramanian",
  "Dr. Nitesh",
  "Dr. Deepak Ramanan",
  "Dr. Deepak Gupta",
];
