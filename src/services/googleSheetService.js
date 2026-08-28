import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    project_id: process.env.GOOGLE_PROJECT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  },
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets"
  ]
});

const sheets = google.sheets({
  version: "v4",
  auth
});

const spreadsheetId = process.env.GOOGLE_SHEET_ID;

export async function getApplications() {
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "신청!A:L"
  });

  return result.data.values || [];
}

export async function appendApplication(row) {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "신청!A:L",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row]
    }
  });
}