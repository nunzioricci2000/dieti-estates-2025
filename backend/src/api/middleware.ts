import type { Logger } from "@dieti-estates-2025/common";
import type {
    NextFunction,
    Request as ExpressRequest,
    Response as ExpressResponse,
    RequestHandler,
    ErrorRequestHandler,
} from "express";

import type { TokenService } from "../auth/interfaces.js";
import { Admin, Agent, type User } from "@dieti-estates-2025/common";

export const advertisementMultipartHandler: RequestHandler = (
    req,
    res,
    next,
) => {
    if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ error: "missing images" });
    }

    req.body.images = req.files.map(
        (f) =>
            `http://${process.env.IP!}:${process.env.PORT}/${f.path.replace("images/", "")}`,
    ) as string[];
    req.body.dimensions = Number(req.body.dimensions);
    req.body.numberOfRooms = Number(req.body.numberOfRooms);
    req.body.price = Number(req.body.price);

    if (typeof req.body.coordinates === "string") {
        req.body.coordinates = JSON.parse(req.body.coordinates);
    }

    if (
        !req.body.coordinates &&
        req.body.latitude !== undefined &&
        req.body.longitude !== undefined
    ) {
        req.body.coordinates = {
            latitude: Number(req.body.latitude),
            longitude: Number(req.body.longitude),
        };
    }

    req.body.additionalServices =
        typeof req.body.additionalServices === "string"
            ? req.body.additionalServices
                .split(",")
                .map((service: string) => service.trim())
                .filter(Boolean)
            : req.body.additionalServices;

    if (
        typeof req.body.agentEmail !== "string" &&
        typeof req.body.email === "string"
    ) {
        req.body.agentEmail = req.body.email;
    }

    req.body.agent = req.user;
    next();
};

export function authenticationHandlerFactory(
    tokenService: TokenService,
): RequestHandler {
    return async (req, _res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader === undefined || !authHeader.startsWith("Bearer ")) {
            return next();
        }

        const jwt = authHeader.replace("Bearer ", "");
        let user: User;
        try {
            user = await tokenService.verifyToken(jwt);
        } catch (e) {
            // Invalid jwt are ignored and the request is treated as unauthenticated
            return next();
        }
        req.user = user;
        next();
    };
}

export function authorizationHandlerFactory(
    authRequirement: "user" | "admin" | "agent",
): RequestHandler {
    return (req, res, next) => {
        const user = req.user;
        if (user === undefined) {
            return res.status(401).json({ error: "unauthenticated" });
        }
        if (authRequirement === "user") {
            // All user types allowed
            return next();
        }
        if (authRequirement === "admin" && user instanceof Admin) {
            return next();
        }
        if (authRequirement === "agent" && user instanceof Agent) {
            return next();
        }
        return res.status(401).json({ error: "unauthorized" });
    };
}

export function errorHandlingMiddlewareFactory(
    logger: Logger,
): ErrorRequestHandler {
    return (
        err: Error,
        _req: ExpressRequest,
        res: ExpressResponse,
        _next: NextFunction,
    ): void => {
        logger.error(`An unexpected error occurred: ${err.message}`, {
            stack: err.stack,
        });
        res.status(500).json({ error: "An unexpected error occurred" });
    };
}

export function responseSenderMiddlewareFactory(
    logger: Logger,
): RequestHandler {
    return (
        _req: ExpressRequest,
        res: ExpressResponse,
        _next: NextFunction,
    ): void => {
        if (res.headersSent) {
            logger.debug(
                "Response already sent by presenter, skipping middleware",
            );
            return;
        }

        const code = (res as any).code;
        const body = (res as any).body;

        logger.debug("Sending response from middleware:", { code, body });

        if (typeof code === "number") {
            res.status(code).json(body);
            return;
        }

        logger.debug("No response code set on res; skipping response send");
        _next();
    };
}
