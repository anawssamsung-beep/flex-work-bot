import { google } from "googleapis";

const privateKey = process.env.GOOGLE_PRIVATE_KEY;

if (!privateKey) {
  throw new Error(
    "GOOGLE_PRIVATE_KEY 환경변수가 없습니다."
  );
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    project_id: process.env.GOOGLE_PROJECT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: privateKey.replace(/\\n/g, "\n")
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

const RANGE = "신청!A:K";


/**
 * 전체 신청내역
 */
export async function getApplications() {

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: RANGE
  });

  return result.data.values || [];
}


/**
 * 특정 사용자의 특정 주차 신청 조회
 */
export async function findApplication(
  userId,
  weekStart
) {

  const rows = await getApplications();

  // 첫 번째 행은 헤더
  for (let i = 1; i < rows.length; i++) {

    const row = rows[i];

    const rowWeek = row[1];
    const rowUserId = row[2];

    if (
      rowWeek === weekStart &&
      rowUserId === userId
    ) {

      return {
        rowNumber: i + 1,

        data: {
          id: row[0] || "",
          weekStart: row[1] || "",
          userId: row[2] || "",
          name: row[3] || "",
          monday: row[4] || "",
          wednesday: row[5] || "",
          friday: row[6] || "",
          status: row[7] || "",
          createdAt: row[8] || "",
          updatedAt: row[9] || "",
          cancelledAt: row[10] || ""
        }
      };
    }
  }

  return null;
}


/**
 * 신규 신청
 */
export async function appendApplication(row) {

  await sheets.spreadsheets.values.append({

    spreadsheetId,

    range: RANGE,

    valueInputOption: "USER_ENTERED",

    insertDataOption: "INSERT_ROWS",

    requestBody: {
      values: [row]
    }

  });

}


/**
 * 특정 행 전체 수정
 */
export async function updateApplication(
  rowNumber,
  row
) {

  await sheets.spreadsheets.values.update({

    spreadsheetId,

    range: `신청!A${rowNumber}:K${rowNumber}`,

    valueInputOption: "USER_ENTERED",

    requestBody: {
      values: [row]
    }

  });

}