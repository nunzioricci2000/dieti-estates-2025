import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import type { TokenService } from "../auth/interfaces.js";
import { Admin, Agent, User } from "@dieti-estates-2025/common";
import { type RepositoryOf } from "@dieti-estates-2025/common";
import ms from "ms";

export class JWTTokenService implements TokenService {
  constructor(
    private readonly secret: string,
    private readonly userRepository: RepositoryOf<
      "User",
      User,
      { email: string }
    >,
    private readonly tokenExpiration: ms.StringValue | number = "2h",
  ) { }

  generateToken(user: User): string {
    // infer by class
    var role: string;
    if (user instanceof Admin) role = "admin";
    if (user instanceof Agent) role = "agent";
    else role = "user";
    const payload: JwtPayload = {
      email: user.email,
      username: user.username,
      role,
    };
    return jwt.sign(payload, this.secret as jwt.Secret, {
      expiresIn: this.tokenExpiration,
    });
  }

  async verifyToken(token: string): Promise<User> {
    const payload = jwt.verify(token, this.secret) as any;
    if (!payload?.email || !payload?.username)
      throw new Error("Invalid token");
    const user = await this.userRepository.readUser({
      email: payload.email,
    });
    return user;
  }
}
