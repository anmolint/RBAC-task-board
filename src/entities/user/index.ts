import { Elysia, t } from "elysia";
import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";
import { loginValidaion, signUpValidation } from "./validations";
import { createUser, getUser } from "./user.dao";
import { envVars } from "../../config";

class DuplicateEmailError extends Error {
  constructor() {
    super("Duplicate email");
  }
}

export const userRouter = () => {
  return new Elysia({ prefix: "/v1/users" })
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
            throw new DuplicateEmailError();
          } else {
            throw exception;
          }
        }
      },
      {
        body: signUpValidation,
        error({ code, error, set }) {
          if (error instanceof DuplicateEmailError) {
            set.status = 409;
            return {
              code: "Invalid-Crednetails",
              message: "Email-already-in-use",
            };
          } else {
            set.status = 500;
            return {
              code: "Internal-Server-Error",
              message: "Something Went Wrong ,Please try again later",
            };
          }
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
          set.status = 403;
          return {
            code: "Invalid-Crednetails",
            message: "Invalid username or password",
          };
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
          code: "Logged-In-Sucessfully",
          data: { token },
        };
      },
      {
        body: loginValidaion,
      }
    );
};
