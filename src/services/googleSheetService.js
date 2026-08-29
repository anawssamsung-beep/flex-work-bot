import { google } from "googleapis";


const privateKey =
  process.env.GOOGLE_PRIVATE_KEY;


if (!privateKey) {

  throw new Error(
    "GOOGLE_PRIVATE_KEY가 없습니다."
  );

}


const auth =
  new google.auth.GoogleAuth({

    credentials: {

      project_id:
        process.env.GOOGLE_PROJECT_ID,

      client_email:
        process.env.GOOGLE_CLIENT_EMAIL,

      private_key:
        privateKey.replace(
          /\\n/g,
          "\n"
        )

    },

    scopes: [
      "https://www.googleapis.com/auth/spreadsheets"
    ]

  });


const sheets =
  google.sheets({

    version: "v4",

    auth

  });


const spreadsheetId =
  process.env.GOOGLE_SHEET_ID;


const APPLICATION_RANGE =
  "신청!A:H";


/**
 * 신청내역 전체 조회
 */
export async function getApplications() {

  const result =
    await sheets.spreadsheets.values.get({

      spreadsheetId,

      range:
        APPLICATION_RANGE

    });


  return (
    result.data.values || []
  );

}


/**
 * 사용자 + 근무일 신청 조회
 */
export async function findApplication(
  userId,
  workDate
) {

  const rows =
    await getApplications();


  for (
    let i = 1;
    i < rows.length;
    i++
  ) {

    const row =
      rows[i];


    const rowUserId =
      row[1] || "";

    const rowWorkDate =
      row[3] || "";

    const rowStatus =
      row[7] || "";


    if (
      rowUserId === userId &&
      rowWorkDate === workDate &&
      rowStatus === "ACTIVE"
    ) {

      return {

        rowNumber:
          i + 1,

        row

      };

    }

  }


  return null;

}


/**
 * 신청 추가
 */
export async function appendApplication(
  row
) {

  await sheets.spreadsheets.values.append({

    spreadsheetId,

    range:
      APPLICATION_RANGE,

    valueInputOption:
      "USER_ENTERED",

    insertDataOption:
      "INSERT_ROWS",

    requestBody: {

      values: [
        row
      ]

    }

  });

}


/**
 * 신청 수정
 */
export async function updateApplication(
  rowNumber,
  row
) {

  await sheets.spreadsheets.values.update({

    spreadsheetId,

    range:
      `신청!A${rowNumber}:H${rowNumber}`,

    valueInputOption:
      "USER_ENTERED",

    requestBody: {

      values: [
        row
      ]

    }

  });

}
/**
 * 오늘 포함 이후 신청 현황 조회
 */
/**
 * 오늘 포함 신청 현황 조회
 */
export async function getUpcomingApplications() {

  const rows =
    await getApplications();

  if (rows.length <= 1) {
    return [];
  }

  const today =
    new Date()
      .toLocaleDateString(
        "sv-SE",
        {
          timeZone: "Asia/Seoul"
        }
      );

  return rows
    .slice(1)
    .filter(row => {

      const workDate =
        row[3] || "";

      const status =
        row[7] || "";

      if (
        !workDate ||
        status !== "ACTIVE"
      ) {
        return false;
      }

      return workDate >= today;

    })
    .sort((a, b) =>
      a[3].localeCompare(b[3])
    );

}