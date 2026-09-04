import {
    appendEmployee,
    updateEmployee,
    appendApplication,
    findApplication,
    updateApplication,
    getUpcomingApplications,
    findEmployeeInfo
} from "./googleSheetService.js";


import {
    getApplicationWeek,
    getKoreaDateTimeString
} from "../utils/dateUtils.js";


const DAY_MAP = {
    monday: true,
    wednesday: true,
    friday: true
};


const TYPE_MAP = {
    EARLY: true,
    LATE: true
};


/**
 * 탄력근무 신청
 */
export async function saveUser({ userId,userName }) {


    const employee = await findEmployeeInfo(userId);
    if (!employee) {
        //신규    

        const updatedRow = [
            userId,             // 사용자ID
            userName,           // 이름
            "Y",      // 이름
        ];
        await appendEmployee(
            updatedRow
        );
        return {
            action: "INSERT",
            message: `${userName}님 사용등록이 완료 되었습니다.`
        };
    }
    //같음    
    if (employee.userName === userName) {
        
        return {
            action: "DUPLICATE",
            message: `이미 등록된 이름입니다.` 
        };
    }
    //수정    
    if (employee.userId) {
        //수정

        const updatedRow = [
            employee.userId,    // 사용자ID
            userName,           // 이름
            "Y",      
        ];
        await updateEmployee(
            employee.rowNumber,
            updatedRow
        );
        return {
            action: "UPDATE",
            message: `${userName}님 이름으로 변경되었습니다.`
        };

    }
    

/**
 * 탄력근무 신청
 */
}
export async function saveWorkApplication({ userId, day, type ,mmdd}) {

    const employee = await findEmployeeInfo(userId);
    
    if (!employee?.userName) {
        throw new Error(
            "등록된 직원 정보를 찾을 수 없습니다.\n@사원 \"이름\"을 입력해주세요."
        );
    }
    /*
     * 사용자 확인
     */

    if (!userId) {
        throw new Error(
            "사용자 ID가 없습니다."
        );
    }
    /*
     * 요일 확인
     */
    if (!DAY_MAP[day]) {
        throw new Error(
            "잘못된 근무일입니다."
        );
    }
    /*
     * 근무형태 확인
     */
    if (!TYPE_MAP[type]) {
        throw new Error(
            "잘못된 근무형태입니다."
        );
    }
    /*
     * 신청 주차
     */
    const week = getApplicationWeek();
    const dayInfo = week[day];
    if (!dayInfo) {
        throw new Error(
            "근무일 정보를 찾을 수 없습니다."
        );
    }
    /*
     * 마감 확인
     */

    if (!dayInfo.available || dayInfo.date !== mmdd) {
        throw new Error(
            `${mmdd?mmdd:dayInfo.date} 신청은 ` +
            `전날 17:00에 마감되었습니다.`
        );
    }
    /*
     * 기존 신청 조회
     */
    const existing = await findApplication(userId, dayInfo.date);
    /*
     * 현재 시간
     */
    const now = getKoreaDateTimeString();
    /*
     * 이미 신청했으면 수정
     */

    if (existing) {
        const old = existing.row;
        const updatedRow = [
            old[0],              // 신청ID
            old[1],              // 사용자ID
            employee.userName || old[2],      // 이름
            old[3],              // 근무일
            type,                // 근무형태
            old[5],              // 주차
            now,                 // 수정시간
            "ACTIVE"
        ];
        await updateApplication(
            existing.rowNumber,
            updatedRow
        );
        return {
            action: "UPDATE",
            message:
                `❇️ ${dayInfo.date} 근무를 ` +
                `${getTypeName(type)}로 변경했습니다.`
        };
    }
    /*
     * 신규 신청
     */

    const applicationId = `${Date.now()}-${userId}`;
    const row = [
        applicationId,
        userId,
        employee.userName || "",
        dayInfo.date,
        type,
        week.weekStart,
        now,
        "ACTIVE"
    ];
    console.log(row);
    await appendApplication(
        row
    );
    return {
        action: "INSERT",
        message:
            `✅ ${dayInfo.date} 근무를 ` +
            `${getTypeName(type)}로 신청했습니다. ` 
    };

}



/**
 * 신청 취소
 */
export async function cancelWorkApplication({userId, day}) {

    if (!userId) {
        throw new Error(
            "사용자 ID가 없습니다."
        );
    }
    const week = getApplicationWeek();


    const dayInfo = week[day];

    if (!dayInfo) {
        throw new Error(
            "잘못된 근무일입니다."
        );
    }
    /*
     * 마감 이후 취소 불가
     */
    if (!dayInfo.available) {
        throw new Error(
            `${dayInfo.date} 취소 가능 시간이 ` +
            `지났습니다.`
        );
    }
    /*
     * 기존 신청 검색
     */
    const existing =
        await findApplication(

            userId,

            dayInfo.date

        );


    if (!existing) {
        throw new Error(
            `${dayInfo.date} 신청내역이 없습니다.`
        );
    }

    const old =existing.row;
    /*
     * CANCEL 처리
     */
    const updatedRow = [
        old[0],
        old[1],
        old[2],
        old[3],
        old[4],
        old[5],
        getKoreaDateTimeString(),
        "CANCEL"
    ];
    await updateApplication(
        existing.rowNumber,
        updatedRow
    );
    return {
        action:"CANCEL",
        message:
            `${dayInfo.date} 탄력근무 신청을 ` +
            `취소했습니다.`

    };

}


/**
 * EARLY / LATE 한글 변환
 */
function getTypeName(type) {

    return type === "EARLY"
        ? "Early"
        : "Late";

}
export async function getUpcomingWorkApplications() {

    const rows = await getUpcomingApplications();

    return rows.map(row => ({
        applicationId   : row[0],
        userId          : row[1],
        name            : row[2],
        workDate        : row[3],
        type            : row[4],
        weekStart       : row[5],
        updatedAt       : row[6],
        status          : row[7]
    }));

}