import express from "express";

import {
  getNextWeekInfo,
  saveApplication,
  cancelWorkApplication
} from "../services/flexService.js";

import {
  getApplications
} from "../services/googleSheetService.js";


const router =
  express.Router();


/**
 * 다음 주 정보
 */
router.get(
  "/next-week",
  (req, res) => {

    res.json({
      success: true,
      data: getNextWeekInfo()
    });

  }
);


/**
 * Google Sheet 조회 테스트
 */
router.get(
  "/test-sheet",
  async (req, res) => {

    try {

      const rows =
        await getApplications();

      res.json({
        success: true,
        count: rows.length,
        data: rows
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);


/**
 * 신청 등록 / 수정
 */
router.post(
  "/application",
  async (req, res) => {

    try {

      const result =
        await saveApplication(req.body);

      res.json({
        success: true,
        result
      });

    } catch (error) {

      console.error(error);

      res.status(400).json({
        success: false,
        message: error.message
      });

    }

  }
);


/**
 * 요일별 취소
 */
router.post(
  "/application/cancel",
  async (req, res) => {

    try {

      const result =
        await cancelWorkApplication(req.body);

      res.json({
        success: true,
        result
      });

    } catch (error) {

      console.error(error);

      res.status(400).json({
        success: false,
        message: error.message
      });

    }

  }
);


export default router;