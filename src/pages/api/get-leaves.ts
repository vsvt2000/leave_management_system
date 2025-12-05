import type { NextApiRequest, NextApiResponse } from "next";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const API_KEY = process.env.GOOGLE_API_KEY;
const SHEET_NAME = "LeaveRequests";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from sheet");
    }

    const data = await response.json();

    if (!data.values || data.values.length <= 1) {
      return res.status(200).json({ requests: [] });
    }

    const headers = data.values[0];
    const rows = data.values.slice(1);

    const requests = rows.map((row: string[]) => ({
      id: row[0],
      employeeName: row[1],
      email: row[2],
      leaveType: row[3],
      startDate: row[4],
      endDate: row[5],
      reason: row[6],
      status: row[7] || "pending",
      submittedAt: row[8],
    }));

    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch leave requests" });
  }
}
