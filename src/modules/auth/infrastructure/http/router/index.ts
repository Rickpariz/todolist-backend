import { Router } from "express";
import main from "../../../../../shared/infrastructure/http/controllers";
import MakeRequestPasswordResetController from "../../factory/make-request-password-reset-controller.factory";
import MakeResetPasswordController from "../../factory/make-reset-password-controller.factory";
import MakeSignInController from "../../factory/make-sign-in-controller.factory";

const authRouter = Router();
authRouter.post("/login", main(MakeSignInController()));
authRouter.post(
  "/request-password-reset",
  main(MakeRequestPasswordResetController())
);
authRouter.post("/reset-password", main(MakeResetPasswordController()));

export { authRouter };
