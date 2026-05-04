import argon2 from "argon2";
import type { HashService } from "../auth/interfaces.js";
import e from "express";

export class Argon2HashService implements HashService {
    async hashString(value: string): Promise<string> {
        return argon2.hash(value);
    }
    async verifyString(value: string, hash: string): Promise<boolean> {
        if (hash.startsWith("$argon2")) {
            return argon2.verify(hash, value);
        } else {
            return value === hash;
        }
    }
}
