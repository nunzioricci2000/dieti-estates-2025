import type { RequestHandler } from "express";

export const advertisementMultipartHandler: RequestHandler = (req, res, next) => {
    if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({"message": "missing images"});
    }

    req.body.images = req.files.map((f: any) => f.path) as string[];
    req.body.dimensions = Number(req.body.dimensions);
    req.body.numberOfRooms = Number(req.body.numberOfRooms);
    req.body.price = Number(req.body.price);

    if (typeof req.body.coordinates === "string") {
        req.body.coordinates = JSON.parse(req.body.coordinates);
    }

    if (!req.body.coordinates && req.body.latitude !== undefined && req.body.longitude !== undefined) {
        req.body.coordinates = {
            latitude: Number(req.body.latitude),
            longitude: Number(req.body.longitude),
        };
    }

    req.body.additionalServices = typeof req.body.additionalServices === "string"
        ? req.body.additionalServices.split(",").map((service: string) => service.trim()).filter(Boolean)
        : req.body.additionalServices;

    if (typeof req.body.agentEmail !== "string" && typeof req.body.email === "string") {
        req.body.agentEmail = req.body.email;
    }
    next();
};
