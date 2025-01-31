import { Router } from "express";
import main from "../../../../../shared/infrastructure/http/controllers";
import { authorize } from "../../../../../shared/infrastructure/http/middlewares/auth";
import MakeCreateUserController from "../../factory/make-create-user-controller.factory";
import MakeUpdateUserController from "../../factory/make-update-user-controller.factory";

const usersRouter = Router();

usersRouter.post("/", main(MakeCreateUserController()));
usersRouter.patch("/:id", authorize, main(MakeUpdateUserController()));

export { usersRouter };
