import { Router, type IRouter } from "express";
import healthRouter from "./health";
import listingsRouter from "./listings";
import profilesRouter from "./profiles";
import discoveryRouter from "./discovery";
import reviewsRouter from "./reviews";
import ordersRouter from "./orders";
import analyticsRouter from "./analytics";
import notificationsRouter from "./notifications";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(listingsRouter);
router.use(profilesRouter);
router.use(discoveryRouter);
router.use(reviewsRouter);
router.use(ordersRouter);
router.use(analyticsRouter);
router.use(notificationsRouter);
router.use(uploadRouter);

export default router;
