// pages/api/submit-leave.ts
import type { NextApiRequest, NextApiResponse } from "next";

const SPREADSHEET_ID = "1AK6BmFAN_PdYT-59m0V7s9F7t-Tw-pVP8IxFCWuaOBg";
const API_KEY = "AIzaSyAIVucUESAd-neTWlElwyKFmoYPfiYzcPk";
const SHEET_NAME = "LeaveRequests";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { employeeName, email, leaveType, startDate, endDate, reason } =
      req.body;
    console.log("Passed 2");

    const timestamp = new Date().toISOString();
    const id = `LR-${Date.now()}`;
    console.log("Passed 1");

    const values = [
      [
        id,
        employeeName,
        email,
        leaveType,
        startDate,
        endDate,
        reason,
        "pending",
        timestamp,
      ],
    ];
    console.log("Passed");
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      }
    );
    console.log("passed - 1");
    if (!response.ok) {
      throw new Error("Failed to append to sheet");
    }

    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Failed to submit leave request", data: error });
  }
}
