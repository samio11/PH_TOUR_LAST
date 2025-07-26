import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuths";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";
import { tourControllers } from "./tour.controller";

const router = Router();

router.post(
  "/create-tour",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  tourControllers.createTour
);
router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourControllers.createTourType
);

export const tourRoutes = router;
