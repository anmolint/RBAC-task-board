import { Elysia, t } from "elysia";
import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";
import { envVars } from "../../config";
import { getUserById, userExists } from "../../entities/user/user.dao";
import { BaseError } from "../../error";
import { employeeType } from "../../entities/user/validations";

export const authentication = new Elysia()
  .use(bearer())
  .use(
    jwt({
      id: "jwt",
      secret: envVars.jwtSecret,
      iat: Date.now(),
      exp: Date.now() + 60 * 60,
    })
  )
  .use(
    cookie({
      httpOnly: true,
    })
  )
  .derive(async ({ bearer, jwt }) => {
    const token = await jwt.verify(bearer as string);
    if (!token) {
      throw new BaseError({
        code: "Unauthorized-Access!!",
        message: "Authentication-Failed-Please-Login-to-access-this-Resource",
      });
    }
    const user = await userExists(token.sub as string);
    if (!user) {
      throw new BaseError({
        code: "Unauthorized-Access!!",
        message: "Authentication-Failed-Please-Login-to-access-this-Resource",
      });
    }
    return { userId: token.sub };
  });

export const managerAuth = new Elysia()
  .use(bearer())
  .use(
    jwt({
      id: "jwt",
      secret: envVars.jwtSecret,
      iat: Date.now(),
      exp: Date.now() + 60 * 60,
    })
  )
  .use(
    cookie({
      httpOnly: true,
    })
  )
  .derive(async ({ bearer, jwt }) => {
    const token = await jwt.verify(bearer as string);
    if (!token) {
      throw new BaseError({
        code: "Unauthorized-Access!!",
        message: "Authentication-Failed-Please-Login-to-access-this-Resource",
      });
    }
    const user = await getUserById(token.sub as string);
    const role = user.role;
    const isAccessAllowed =
      role === employeeType.admin || role === employeeType.manager;
    if (!user || !isAccessAllowed) {
      throw new BaseError({
        code: "Unauthorized-Access!!",
        message: "You Don't have Permission to Access this Resource",
      });
    }
    return { manager: user };
  });
