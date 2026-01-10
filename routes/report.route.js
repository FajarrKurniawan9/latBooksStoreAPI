import express from "express";
import {
  getReportSalesInRange,
  getReportUserHomePage,
  getReportWishlistsOrOrders,
  putUpdateUsersInfo,
} from "../controllers/report.controller.js";

import { authorize } from "../controllers/auth.controller.js";
const router = express.Router();

router.get("/user-homepage", authorize, getReportUserHomePage);
router.get("/sales-range", authorize, getReportSalesInRange);
router.get("/wishlists-or-orders", authorize, getReportWishlistsOrOrders);
router.put("/update-users-info", authorize, putUpdateUsersInfo);
export default router;
