import {
    Advertisement,
    Agent,
    Coordinates,
    Period,
    Price,
    Rental,
    RentPrice,
    Sale,
    ValueAlreadyExistsException,
    ValueNotFoundException,
    type Logger,
    type ReaderOf,
    type UpdaterOf,
} from "@dieti-estates-2025/common";
import type { AdvertisementRepository } from "../dashboard/interfaces.js";
import {
    AdvertisementsMetrics,
    AdvertisementData,
} from "../dashboard/data-objects.js";
import type { SearchFilters } from "../user/filter-advertisements-interactor.js";
import {
    PrismaClient,
    type Advertisement as PersistedAdvertisement,
    type User as PersistedUser,
} from "./generated/prisma/client.js";
import { AdvertisementType, UserRole } from "./generated/prisma/enums.js";
import type { Prisma } from "./generated/prisma/client.js";

type PersistedAdvertisementWithAuthor = PersistedAdvertisement & {
    author: PersistedUser;
};

export class PrismaAdvertisementRepository
    implements
    AdvertisementRepository,
    ReaderOf<"AdvertisementData", AdvertisementData, { id: number }>,
    UpdaterOf<"AdvertisementData", AdvertisementData, { id: number }>,
    ReaderOf<"AdvertisementMetrics", AdvertisementsMetrics, null> {
    constructor(
        private prisma: PrismaClient,
        private logger: Logger,
    ) {
        this.logger.info("PrismaAdvertisementRepository created");
    }

    async createAdvertisement(
        advertisement: Advertisement,
    ): Promise<Advertisement> {
        this.logger.debug(
            `Creating advertisement for agent ${advertisement.agent.email}`,
        );

        const existing = await this.findPersistedByDomainId(advertisement.id);
        if (existing) {
            this.logger.warn(
                `Advertisement already exists with id ${advertisement.id}`,
            );
            throw new ValueAlreadyExistsException({ id: advertisement.id });
        }

        const author = await this.prisma.user.findUnique({
            where: { email: advertisement.agent.email },
        });

        if (!author || author.role !== UserRole.AGENT) {
            this.logger.warn(
                `Cannot create advertisement for missing agent ${advertisement.agent.email}`,
            );
            throw new ValueNotFoundException({
                email: advertisement.agent.email,
            });
        }

        const nextId =
            advertisement.id > 0 ? advertisement.id : await this.nextDomainId();
        const persisted = await this.prisma.advertisement.create({
            data: {
                id: String(nextId),
                address: advertisement.address,
                city: advertisement.city,
                latitude: advertisement.location.latitude,
                longitude: advertisement.location.longitude,
                description: advertisement.description,
                dimensions: advertisement.dimensions,
                numberOfRooms: advertisement.numberOfRooms,
                energyClass: advertisement.energyClass,
                available: advertisement.available,
                price: this.extractPrice(advertisement),
                images: advertisement.images.map((image) => image.url),
                additionalServices: advertisement.additionalServices,
                nearbyPOIs: advertisement.nearbyPOIs,
                type: this.extractType(advertisement),
                authorId: author.id,
            },
            include: { author: true },
        });

        this.logger.info(`Advertisement created with id ${nextId}`);
        return this.toDomainAdvertisement(persisted);
    }

    async readAdvertisement({ id }: { id: number }): Promise<Advertisement> {
        this.logger.debug(`Reading advertisement with id ${id}`);
        const found = await this.findPersistedWithAuthorByDomainId(id);

        if (!found) {
            this.logger.warn(`Advertisement not found with id ${id}`);
            throw new ValueNotFoundException({ id });
        }

        return this.toDomainAdvertisement(found);
    }

    async updateAdvertisement(
        advertisement: Advertisement,
    ): Promise<Advertisement> {
        this.logger.debug(`Updating advertisement with id ${advertisement.id}`);
        const existing = await this.findPersistedByDomainId(advertisement.id);

        if (!existing) {
            this.logger.warn(
                `Advertisement not found with id ${advertisement.id}`,
            );
            throw new ValueNotFoundException({ id: advertisement.id });
        }

        const author = await this.prisma.user.findUnique({
            where: { email: advertisement.agent.email },
        });

        if (!author || author.role !== UserRole.AGENT) {
            this.logger.warn(
                `Cannot update advertisement for missing agent ${advertisement.agent.email}`,
            );
            throw new ValueNotFoundException({
                email: advertisement.agent.email,
            });
        }

        const updated = await this.prisma.advertisement.update({
            where: { id: existing.id },
            data: {
                address: advertisement.address,
                city: advertisement.city,
                latitude: advertisement.location.latitude,
                longitude: advertisement.location.longitude,
                description: advertisement.description,
                dimensions: advertisement.dimensions,
                numberOfRooms: advertisement.numberOfRooms,
                energyClass: advertisement.energyClass,
                available: advertisement.available,
                price: this.extractPrice(advertisement),
                images: advertisement.images.map((image) => image.url),
                additionalServices: advertisement.additionalServices,
                nearbyPOIs: advertisement.nearbyPOIs,
                type: this.extractType(advertisement),
                authorId: author.id,
            },
            include: { author: true },
        });

        this.logger.info(`Advertisement updated with id ${advertisement.id}`);
        return this.toDomainAdvertisement(updated);
    }

    async deleteAdvertisement({ id }: { id: number }): Promise<Advertisement> {
        this.logger.debug(`Deleting advertisement with id ${id}`);
        const existing = await this.findPersistedByDomainId(id);

        if (!existing) {
            this.logger.warn(`Advertisement not found with id ${id}`);
            throw new ValueNotFoundException({ id });
        }

        const deleted = await this.prisma.advertisement.delete({
            where: { id: existing.id },
            include: { author: true },
        });

        this.logger.info(`Advertisement deleted with id ${id}`);
        return this.toDomainAdvertisement(deleted);
    }

    async readAllAdvertisements(): Promise<Advertisement[]> {
        const ads: PersistedAdvertisementWithAuthor[] =
            await this.prisma.advertisement.findMany({
                include: { author: true },
                orderBy: { id: "asc" },
            });

        return ads.map((ad) => this.toDomainAdvertisement(ad));
    }

    async filterAdvertisements(
        filters: SearchFilters,
    ): Promise<Advertisement[]> {
        this.logger.debug("Filtering advertisements");

        const where: Prisma.AdvertisementWhereInput = {};
        if (filters.area) {
            where.city = {
                contains: filters.area,
                mode: "insensitive",
            };
        }
        if (
            typeof filters.dimensionsMin === "number" ||
            typeof filters.dimensionsMax === "number"
        ) {
            where.dimensions = {
                gte: filters.dimensionsMin,
                lte: filters.dimensionsMax,
            };
        }
        if (
            typeof filters.numberOfRoomsMin === "number" ||
            typeof filters.numberOfRoomsMax === "number"
        ) {
            where.numberOfRooms = {
                gte: filters.numberOfRoomsMin,
                lte: filters.numberOfRoomsMax,
            };
        }
        if (filters.acceptableEnergyClasses) {
            where.energyClass = { in: filters.acceptableEnergyClasses };
        }

        const ads: PersistedAdvertisementWithAuthor[] =
            await this.prisma.advertisement.findMany({
                where,
                include: { author: true },
            });

        const filteredByDistance =
            filters.location && Number.isFinite(filters.distance)
                ? ads.filter((ad) => {
                    const distanceKm = this.distanceInKm(
                        filters.location!.latitude,
                        filters.location!.longitude,
                        ad.latitude,
                        ad.longitude,
                    );
                    return distanceKm <= (filters.distance as number);
                })
                : ads;

        return filteredByDistance.map((ad) => this.toDomainAdvertisement(ad));
    }

    async readAdvertisementData(advertisementRef: {
        id: number;
    }): Promise<AdvertisementData> {
        const advertisementId = advertisementRef.id;
        const persisted =
            await this.findPersistedWithAuthorByDomainId(advertisementId);
        if (!persisted) {
            throw new ValueNotFoundException({ id: advertisementId });
        }

        return this.toAdvertisementData(persisted);
    }

    async updateAdvertisementData(
        advertisementRef: { id: number },
        value: AdvertisementData,
    ): Promise<AdvertisementData> {
        const advertisementId = advertisementRef.id;
        const existing = await this.findPersistedByDomainId(advertisementId);
        if (!existing) {
            throw new ValueNotFoundException({ advertisementId });
        }

        const updated = await this.prisma.advertisement.update({
            where: { id: existing.id },
            data: {
                views: value.views,
                visits: value.visits,
                offers: value.offers,
            },
            include: { author: true },
        });

        return this.toAdvertisementData(updated);
    }

    async readAllAdvertisementData(): Promise<AdvertisementData[]> {
        const advertisements: PersistedAdvertisementWithAuthor[] =
            await this.prisma.advertisement.findMany({
                include: { author: true },
                orderBy: { id: "asc" },
            });

        return advertisements.map((advertisement) =>
            this.toAdvertisementData(advertisement),
        );
    }

    async readAdvertisementMetrics(): Promise<AdvertisementsMetrics> {
        const data = await this.readAllAdvertisementData();
        const ads = data.map((item) => item.advertisement);

        const totals = data.reduce(
            (acc, current) => {
                return {
                    visits: acc.visits + current.visits,
                    views: acc.views + current.views,
                };
            },
            { visits: 0, views: 0 },
        );

        return new AdvertisementsMetrics(totals.visits, totals.views, ads);
    }

    private toAdvertisementData(
        persisted: PersistedAdvertisementWithAuthor,
    ): AdvertisementData {
        const advertisement = this.toDomainAdvertisement(persisted);
        return new AdvertisementData(
            advertisement,
            persisted.visits,
            persisted.views,
            persisted.offers,
        );
    }

    private async findPersistedByDomainId(
        id: number,
    ): Promise<PersistedAdvertisement | null> {
        const byStringId = await this.prisma.advertisement.findUnique({
            where: { id: String(id) },
        });
        if (byStringId) {
            return byStringId;
        }

        const all: Array<Pick<PersistedAdvertisement, "id">> =
            await this.prisma.advertisement.findMany({
                select: { id: true },
            });

        const match = all.find((ad) => this.parseDomainId(ad.id) === id);
        if (!match) {
            return null;
        }

        return this.prisma.advertisement.findUnique({
            where: { id: match.id },
        });
    }

    private async findPersistedWithAuthorByDomainId(
        id: number,
    ): Promise<PersistedAdvertisementWithAuthor | null> {
        const byStringId = await this.prisma.advertisement.findUnique({
            where: { id: String(id) },
            include: { author: true },
        });
        if (byStringId) {
            return byStringId;
        }

        const all: Array<Pick<PersistedAdvertisement, "id">> =
            await this.prisma.advertisement.findMany({
                select: { id: true },
            });

        const match = all.find((ad) => this.parseDomainId(ad.id) === id);
        if (!match) {
            return null;
        }

        return this.prisma.advertisement.findUnique({
            where: { id: match.id },
            include: { author: true },
        });
    }

    private async nextDomainId(): Promise<number> {
        const ids: Array<Pick<PersistedAdvertisement, "id">> =
            await this.prisma.advertisement.findMany({
                select: { id: true },
            });

        const maxId = ids.reduce((max, current) => {
            const parsed = this.parseDomainId(current.id);
            return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
        }, 0);

        return maxId + 1;
    }

    private parseDomainId(persistedId: string): number {
        const parsed = Number.parseInt(persistedId, 10);
        if (!Number.isNaN(parsed)) {
            return parsed;
        }

        const hash = Array.from(persistedId).reduce((acc, char) => {
            return (acc * 31 + char.charCodeAt(0)) % 2147483647;
        }, 0);

        return hash;
    }

    private extractType(advertisement: Advertisement): AdvertisementType {
        if (advertisement instanceof Sale) {
            return AdvertisementType.SALE;
        }
        if (advertisement instanceof Rental) {
            return AdvertisementType.RENT;
        }

        return "rentPrice" in advertisement
            ? AdvertisementType.RENT
            : AdvertisementType.SALE;
    }

    private extractPrice(advertisement: Advertisement): number {
        if (advertisement instanceof Sale) {
            return advertisement.price.value;
        }
        if (advertisement instanceof Rental) {
            return advertisement.rentPrice.price.value;
        }
        if (this.isRental(advertisement)) {
            return advertisement.rentPrice.price.value;
        }
        if (this.isSale(advertisement)) {
            return advertisement.price.value;
        }

        throw new TypeError("Unknown advertisement subtype");
    }

    private toDomainAdvertisement(
        persisted: PersistedAdvertisementWithAuthor,
    ): Advertisement {
        const id = this.parseDomainId(persisted.id);
        const location = new Coordinates(
            persisted.latitude,
            persisted.longitude,
        );
        const images = persisted.images.map(
            (url: string) => ({ url }) as Advertisement["images"][number],
        );
        const agent = new Agent(
            persisted.author.email,
            persisted.author.username,
        );

        if (persisted.type === AdvertisementType.SALE) {
            return new Sale(
                id,
                persisted.address,
                persisted.city,
                location,
                images,
                persisted.description,
                persisted.dimensions,
                persisted.numberOfRooms,
                persisted.energyClass,
                persisted.additionalServices,
                persisted.nearbyPOIs,
                persisted.available,
                agent,
                new Price(persisted.price),
            );
        }

        return new Rental(
            id,
            persisted.address,
            persisted.city,
            location,
            images,
            persisted.description,
            persisted.dimensions,
            persisted.numberOfRooms,
            persisted.energyClass,
            persisted.additionalServices,
            persisted.nearbyPOIs,
            persisted.available,
            agent,
            new RentPrice(persisted.price, Period.Month),
        );
    }

    private isRental(
        advertisement: Advertisement,
    ): advertisement is Advertisement & { rentPrice: RentPrice } {
        return "rentPrice" in advertisement;
    }

    private isSale(
        advertisement: Advertisement,
    ): advertisement is Advertisement & { price: Price } {
        return "price" in advertisement;
    }

    private distanceInKm(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
    ): number {
        const radians = (degrees: number) => (degrees * Math.PI) / 180;
        const earthRadiusKm = 6371;

        const dLat = radians(lat2 - lat1);
        const dLon = radians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(radians(lat1)) *
            Math.cos(radians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }
}
