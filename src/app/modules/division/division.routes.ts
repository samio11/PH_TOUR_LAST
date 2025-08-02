import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuths";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";
import { divisionControllers } from "./division.controller";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  divisionControllers.createDivision
);

router.get("/", divisionControllers.getAllDivisions);

router.patch(
  "/update/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  divisionControllers.updateDivision
);

export const divisionRoutes = router;
