import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { divisionRoutes } from "../modules/division/division.routes";
import { tourRoutes } from "../modules/tour/tour.routes";
import { bookingRoutes } from "../modules/booking/booking.route";
import { paymentRoutes } from "../modules/payment/payment.routes";

export const route = Router();

const moduleRoute = [
  {
    path: "/auth",
    element: authRoutes,
  },
  {
    path: "/division",
    element: divisionRoutes,
  },
  {
    path: "/tour",
    element: tourRoutes,
  },
  {
    path: "/booking",
    element: bookingRoutes,
  },
  {
    path: "/payment",
    element: paymentRoutes,
  },
];

moduleRoute.forEach((x) => route.use(x.path, x.element));
