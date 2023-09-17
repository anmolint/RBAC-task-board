import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";
import { ulid } from "ulidx";
import { loginValidation, signUpValidation } from "./validations";
import { createUser, getUser, getUserById } from "./user.dao";
import { envVars } from "../../config";
import { BaseError } from "../../error";
import { authentication } from "../../libs/auth";

export const userRouter = () => {
  return new Elysia({ prefix: "/v1/users" })
    .use(
      jwt({
        jti: ulid(),
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
    .post(
      "/sign-up",
      async ({ body }) => {
        try {
          const password = await Bun.password.hash(body.password, {
            algorithm: "argon2id",
            memoryCost: 4,
            timeCost: 3,
          });
          body.password = password;
          const registeredUser = await createUser(body);
          return registeredUser;
        } catch (exception) {
          if (exception.code === "23505") {
            throw new BaseError({
              code: "Duplicate-Email",
              message: "User-With-Given-Email-already-Exists",
            });
          } else {
            throw exception;
          }
        }
      },
      {
        body: signUpValidation,
        error({ code, error, set }) {
          if (code === "VALIDATION" || code === "PARSE") {
            set.status = 400;
            return {
              code: "Validation-Error",
              message: "Please pass the correct parameter type",
            };
          }
          if (error instanceof BaseError) {
            set.status = 409;
            return {
              code: error.data.code,
              message: error.data.message,
            };
          }
          set.status = 500;
          return {
            code: "Internal-Server-Error",
            message: "Something Went Wrong ,Please try again later",
          };
        },
      }
    )
    .post(
      "/login",
      async ({ body, set, jwt, setCookie }) => {
        const user = await getUser(body.email);
        const password = user.password;
        const isMatch = await Bun.password.verify(body.password, password);
        if (!isMatch) {
          throw new BaseError({
            code: "Invalid-Credentials",
            message: "Invalid username or password",
          });
        }
        const payload = {
          sub: user.id,
        };
        const token = await jwt.sign(payload);
        setCookie("auth", token, {
          httpOnly: true,
          maxAge: 7 * 86400,
        });
        set.status = 200;
        return {
          code: "Logged-In-Successfully",
          data: { token },
        };
      },
      {
        body: loginValidation,
        error({ code, error, set }) {
          if (code === "VALIDATION") {
            set.status = 400;
            return {
              code: "Validation-Error",
              message: "Please pass the correct parameters",
            };
          }

          if (error instanceof BaseError) {
            set.status = 403;
            return {
              code: error.data.code,
              message: error.data.message,
            };
          }
          set.status = 500;
          return {
            code: "Internal-Server-Error",
            message: "Something Went Wrong ,Please try again later",
          };
        },
      }
    )
    .use(authentication)
    .get(
      "/profile",
      async ({ userId }) => {
        const user = await getUserById(userId as string);
        return user;
      },
      {
        error({ code, error, set }) {
          if (code === "VALIDATION") {
            set.status = 400;
            return {
              code: "Validation-Error",
              message: "Please pass the correct parameters",
            };
          }

          if (error instanceof BaseError) {
            set.status = 401;
            return {
              code: error.data.code,
              message: error.data.message,
            };
          }
          set.status = 500;
          return {
            code: "Internal-Server-Error",
            message: "Something Went Wrong ,Please try again later",
          };
        },
      }
    );
};
