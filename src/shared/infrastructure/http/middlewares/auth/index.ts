import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../../responses";
import * as jwt from "jsonwebtoken";
import { DomainError } from "../../../../domain/domain.error";

async function authorize(req: Request, res: Response, next: NextFunction) {
  try {
    const jwtToken = extractTokenFromHeaders(req);

    const decoded = jwt.verify(
      jwtToken,
      String(process.env.JWT_SECRET)
    ) as jwt.JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (err) {
    if (err instanceof DomainError) {
      return res
        .status(err.statusCode)
        .json({ message: err.message, errors: err?.errors });
    }

    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: err.message });
    }

    return res.status(500).json({ message: err });
  }
}

function extractTokenFromHeaders(req: Request) {
  const { headers } = req;

  const authorization = headers["Authorization"] || headers["authorization"];

  if (!authorization) throw Unauthorized();

  const jwtToken = (authorization as string).substring(7, authorization.length);

  return jwtToken;
}

export { authorize, extractTokenFromHeaders };
