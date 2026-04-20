import {
    User,
    ValueAlreadyExistsException,
    ValueNotFoundException,
    type Logger,
    type RepositoryOf,
} from "@dieti-estates-2025/common";
import { PrismaClient, type User as PersistedUser } from "./generated/prisma/client.js";
import { UserRole } from "./generated/prisma/enums.js";


export class AuthRepository implements RepositoryOf<"User", User, Pick<User, "email">>, RepositoryOf<"Password", string, User> {
    constructor(private prisma: PrismaClient, private logger: Logger) {
        this.logger.info("AuthRepository created");
    }

    async createUser(user: User): Promise<User> {
        this.logger.debug(`Creating user with email ${user.email}`);
        const existingUser = await this.prisma.user.findUnique({
            where: { email: user.email },
        });

        if (existingUser) {
            this.logger.warn(`User already exists with email ${user.email}`);
            throw new ValueAlreadyExistsException({ email: user.email });
        }

        const createdUser = await this.prisma.user.create({
            data: {
                email: user.email,
                username: user.username,
                passwordHash: "",
                role: UserRole.USER,
            },
        });

        this.logger.info(`User created with email ${user.email}`);
        return this.toDomainUser(createdUser);
    }

    async readUser({ email }: Pick<User, "email">): Promise<User> {
        this.logger.debug(`Reading user with email ${email}`);
        const found = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!found) {
            this.logger.warn(`User not found with email ${email}`);
            throw new ValueNotFoundException({ email });
        }

        this.logger.debug(`User read successfully with email ${email}`);
        return this.toDomainUser(found);
    }

    async updateUser(user: User): Promise<User> {
        this.logger.debug(`Updating user with email ${user.email}`);
        const found = await this.prisma.user.findUnique({
            where: { email: user.email },
        });

        if (!found) {
            this.logger.warn(`Cannot update missing user with email ${user.email}`);
            throw new ValueNotFoundException({ email: user.email });
        }

        const updated = await this.prisma.user.update({
            where: { email: user.email },
            data: { username: user.username },
        });

        this.logger.info(`User updated with email ${user.email}`);
        return this.toDomainUser(updated);
    }

    async deleteUser({ email }: Pick<User, "email">): Promise<User> {
        this.logger.debug(`Deleting user with email ${email}`);
        try {
            const deleted = await this.prisma.user.delete({
                where: { email },
            });

            this.logger.info(`User deleted with email ${email}`);
            return this.toDomainUser(deleted);
        } catch {
            this.logger.warn(`Cannot delete missing user with email ${email}`);
            throw new ValueNotFoundException({ email });
        }
    }

    async createPassword(user: User, password: string): Promise<User> {
        this.logger.debug(`Creating password for user ${user.email}`);
        const found = await this.prisma.user.findUnique({
            where: { email: user.email },
        });

        if (!found) {
            this.logger.warn(`Cannot create password for missing user ${user.email}`);
            throw new ValueNotFoundException({ email: user.email });
        }

        if (found.passwordHash.length > 0) {
            this.logger.warn(`Password already exists for user ${user.email}`);
            throw new ValueAlreadyExistsException(user);
        }

        const updated = await this.prisma.user.update({
            where: { email: user.email },
            data: { passwordHash: password },
        });

        this.logger.info(`Password created for user ${user.email}`);
        return this.toDomainUser(updated);
    }

    async readPassword(user: User): Promise<string> {
        this.logger.debug(`Reading password hash for user ${user.email}`);
        const found = await this.prisma.user.findUnique({
            where: { email: user.email },
            select: { passwordHash: true },
        });

        if (!found || found.passwordHash.length === 0) {
            this.logger.warn(`Password hash not found for user ${user.email}`);
            throw new ValueNotFoundException(user);
        }

        this.logger.debug(`Password hash read for user ${user.email}`);
        return found.passwordHash;
    }

    async updatePassword(user: User, newPassword: string): Promise<string> {
        this.logger.debug(`Updating password for user ${user.email}`);
        const found = await this.prisma.user.findUnique({
            where: { email: user.email },
            select: { passwordHash: true },
        });

        if (!found || found.passwordHash.length === 0) {
            this.logger.warn(`Cannot update missing password for user ${user.email}`);
            throw new ValueNotFoundException(user);
        }

        await this.prisma.user.update({
            where: { email: user.email },
            data: { passwordHash: newPassword },
        });

        this.logger.info(`Password updated for user ${user.email}`);
        return newPassword;
    }

    async deletePassword(user: User): Promise<string> {
        this.logger.debug(`Deleting password for user ${user.email}`);
        const found = await this.prisma.user.findUnique({
            where: { email: user.email },
            select: { passwordHash: true },
        });

        if (!found || found.passwordHash.length === 0) {
            this.logger.warn(`Cannot delete missing password for user ${user.email}`);
            throw new ValueNotFoundException(user);
        }

        await this.prisma.user.update({
            where: { email: user.email },
            data: { passwordHash: "" },
        });

        this.logger.info(`Password deleted for user ${user.email}`);
        return found.passwordHash;
    }

    private toDomainUser(user: PersistedUser): User {
        return new User(user.email, user.username);
    }
}