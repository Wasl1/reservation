import express from "express";
import { createBooking, listBookings } from "../controllers/controller.js";

const router = express.Router();

router.post('/bookings', createBooking);
router.get('/bookings', listBookings);

export default router;
