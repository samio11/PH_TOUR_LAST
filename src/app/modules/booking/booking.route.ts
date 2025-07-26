import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuths";
import { Role } from "../user/user.interface";
import { bookingControllers } from "./booking.controller";

const router = Router();

router.post(
  "/",
  checkAuth(...Object.values(Role)),
  bookingControllers.createBooking
);

export const bookingRoutes = router;
