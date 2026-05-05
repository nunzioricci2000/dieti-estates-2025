import jwt, { type JwtPayload } from "jsonwebtoken";
import type { TokenService } from "../auth/interfaces.js";
import { User } from "@dieti-estates-2025/common";
import { type RepositoryOf } from "@dieti-estates-2025/common";

export class JWTTokenService implements TokenService {
  constructor(
    private readonly secret: string, 
    private readonly userRepository: RepositoryOf<"User", User, {email: string}>) {}

  generateToken(user: User): string {
    const payload: JwtPayload = { email: user.email, username: user.username };
    return jwt.sign(payload, this.secret as jwt.Secret);
  }


  async verifyToken(token: string): Promise<User> {
    const payload = jwt.verify(token, this.secret) as any;
    if (!payload?.email || !payload?.username) throw new Error("Invalid token");
    const user = await this.userRepository.readUser({email: payload.email});
    return user;
  }
}