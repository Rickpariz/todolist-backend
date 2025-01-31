import { Request, Response } from "express";
import { Controller } from "../../../domain/controller";
import { DomainError } from "../../../domain/domain.error";
import logger from "../../logger";

const main = (service: Controller) => {
  return async (req: Request, res: Response) => {
    try {
      const { statusCode, body } = await service.handle(req);
      return res.status(statusCode).json(body);
    } catch (err: any) {
      logger.error(err?.message || err)
      if (err instanceof DomainError) {
        return res
          .status(err.statusCode)
          .json({ message: err.message, errors: err?.errors });
      }

      return res.status(500).json({ message: err });
    }
  };
};

export default main;
