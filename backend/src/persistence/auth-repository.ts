import {
    Admin,
    Agent,
    User,
    ValueAlreadyExistsException,
    ValueNotFoundException,
    type Logger,
    type RepositoryOf,
} from "@dieti-estates-2025/common";
import {
    PrismaClient,
    type User as PersistedUser,
} from "./generated/prisma/client.js";
import { UserRole } from "./generated/prisma/enums.js";

export class PrismaAuthRepository
    implements
    RepositoryOf<"User", User, Pick<User, "email">>,
    RepositoryOf<"Password", string, User>,
    RepositoryOf<"Agent", Agent, Pick<Agent, "email">>,
    RepositoryOf<"Admin", Admin, Pick<Admin, "email">> {
    constructor(
        private prisma: PrismaClient,
        private logger: Logger,
    ) {
        this.logger.info("AuthRepository created");
    }

    async createUser(user: User): Promise<User> {
        const createdUser = await this.createPrincipal(
            user,
            UserRole.USER,
            "user",
        );
        return this.toDomainUser(createdUser);
    }

    async readUser({ email }: Pick<User, "email">): Promise<User> {
        const found = await this.readPrincipal(email, "user");
        return this.toDomainUser(found);
    }

    async updateUser(user: User): Promise<User> {
        const updated = await this.updatePrincipal(user, "user");
        return this.toDomainUser(updated);
    }

    async deleteUser({ email }: Pick<User, "email">): Promise<User> {
        const deleted = await this.deletePrincipal(email, "user");
        return this.toDomainUser(deleted);
    }

    async createPassword(user: User, password: string): Promise<User> {
        this.logger.debug(`Creating password for user ${user.email}`);
        const found = await this.prisma.user.findUnique({
            where: { email: user.email },
        });

        if (!found) {
            this.logger.warn(
                `Cannot create password for missing user ${user.email}`,
            );
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
        const passwordHash = await this.readPasswordHashOrThrow(
            user,
            `Password hash not found for user ${user.email}`,
        );
        this.logger.debug(`Password hash read for user ${user.email}`);
        return passwordHash;
    }

    async updatePassword(user: User, newPassword: string): Promise<string> {
        this.logger.debug(`Updating password for user ${user.email}`);
        await this.readPasswordHashOrThrow(
            user,
            `Cannot update missing password for user ${user.email}`,
        );

        await this.prisma.user.update({
            where: { email: user.email },
            data: { passwordHash: newPassword },
        });

        this.logger.info(`Password updated for user ${user.email}`);
        return newPassword;
    }

    async deletePassword(user: User): Promise<string> {
        this.logger.debug(`Deleting password for user ${user.email}`);
        const passwordHash = await this.readPasswordHashOrThrow(
            user,
            `Cannot delete missing password for user ${user.email}`,
        );

        await this.prisma.user.update({
            where: { email: user.email },
            data: { passwordHash: "" },
        });

        this.logger.info(`Password deleted for user ${user.email}`);
        return passwordHash;
    }

    async createAgent(agent: Agent): Promise<Agent> {
        const createdAgent = await this.createPrincipal(
            agent,
            UserRole.AGENT,
            "agent",
        );
        return this.toDomainUser(createdAgent) as Agent;
    }

    async readAgent({ email }: Pick<Agent, "email">): Promise<Agent> {
        const found = await this.readPrincipal(email, "agent", UserRole.AGENT);
        return this.toDomainUser(found) as Agent;
    }

    async updateAgent(agent: Agent): Promise<Agent> {
        const updated = await this.updatePrincipal(
            agent,
            "agent",
            UserRole.AGENT,
        );
        return this.toDomainUser(updated) as Agent;
    }

    async deleteAgent({ email }: Pick<Agent, "email">): Promise<Agent> {
        const deleted = await this.deletePrincipal(
            email,
            "agent",
            UserRole.AGENT,
        );
        return this.toDomainUser(deleted) as Agent;
    }

    async createAdmin(admin: Admin): Promise<Admin> {
        const createdAdmin = await this.createPrincipal(
            admin,
            UserRole.ADMIN,
            "admin",
        );
        return this.toDomainUser(createdAdmin) as Admin;
    }

    async readAdmin({ email }: Pick<Admin, "email">): Promise<Admin> {
        const found = await this.readPrincipal(email, "admin", UserRole.ADMIN);
        return this.toDomainUser(found) as Admin;
    }

    async updateAdmin(admin: Admin): Promise<Admin> {
        const updated = await this.updatePrincipal(
            admin,
            "admin",
            UserRole.ADMIN,
        );
        return this.toDomainUser(updated) as Admin;
    }

    async deleteAdmin({ email }: Pick<Admin, "email">): Promise<Admin> {
        const deleted = await this.deletePrincipal(
            email,
            "admin",
            UserRole.ADMIN,
        );
        return this.toDomainUser(deleted) as Admin;
    }

    private async createPrincipal(
        principal: User | Agent | Admin,
        role: UserRole,
        entityName: string,
    ): Promise<PersistedUser> {
        this.logger.debug(
            `Creating ${entityName} with email ${principal.email}`,
        );
        const existing = await this.prisma.user.findUnique({
            where: { email: principal.email },
        });

        if (existing) {
            this.logger.warn(
                `${this.capitalize(entityName)} already exists with email ${principal.email}`,
            );
            throw new ValueAlreadyExistsException({ email: principal.email });
        }

        const created = await this.prisma.user.create({
            data: {
                email: principal.email,
                username: principal.username,
                passwordHash: "",
                role,
            },
        });

        this.logger.info(
            `${this.capitalize(entityName)} created with email ${principal.email}`,
        );
        return created;
    }

    private async readPrincipal(
        email: string,
        entityName: string,
        expectedRole?: UserRole,
    ): Promise<PersistedUser> {
        this.logger.debug(`Reading ${entityName} with email ${email}`);
        const found = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!found || (expectedRole && found.role !== expectedRole)) {
            this.logger.warn(
                `${this.capitalize(entityName)} not found with email ${email}`,
            );
            throw new ValueNotFoundException({ email });
        }

        this.logger.debug(
            `${this.capitalize(entityName)} read successfully with email ${email}`,
        );
        return found;
    }

    private async updatePrincipal(
        principal: User | Agent | Admin,
        entityName: string,
        expectedRole?: UserRole,
    ): Promise<PersistedUser> {
        this.logger.debug(
            `Updating ${entityName} with email ${principal.email}`,
        );
        await this.readPrincipal(principal.email, entityName, expectedRole);

        const updated = await this.prisma.user.update({
            where: { email: principal.email },
            data: { username: principal.username },
        });

        this.logger.info(
            `${this.capitalize(entityName)} updated with email ${principal.email}`,
        );
        return updated;
    }

    private async deletePrincipal(
        email: string,
        entityName: string,
        expectedRole?: UserRole,
    ): Promise<PersistedUser> {
        this.logger.debug(`Deleting ${entityName} with email ${email}`);
        await this.readPrincipal(email, entityName, expectedRole);

        const deleted = await this.prisma.user.delete({
            where: { email },
        });

        this.logger.info(
            `${this.capitalize(entityName)} deleted with email ${email}`,
        );
        return deleted;
    }

    private async readPasswordHashOrThrow(
        user: User,
        warnMessage: string,
    ): Promise<string> {
        const found = await this.prisma.user.findUnique({
            where: { email: user.email },
            select: { passwordHash: true },
        });

        if (!found || found.passwordHash.length === 0) {
            this.logger.warn(warnMessage);
            throw new ValueNotFoundException(user);
        }

        return found.passwordHash;
    }

    private capitalize(value: string): string {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    private toDomainUser(user: PersistedUser): User {
        if (user.role === UserRole.ADMIN) {
            return new Admin(user.email, user.username);
        } else if (user.role === UserRole.AGENT) {
            return new Agent(user.email, user.username);
        }
        return new User(user.email, user.username);
    }
}
