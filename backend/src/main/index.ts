import "dotenv/config";
import express, {
    type NextFunction,
    type Request as ExpressRequest,
    type Response as ExpressResponse,
} from "express";
import {
    Admin,
    Agent,
    Container,
    User,
    type Advertisement,
    type CreatorOf,
    type EventPublisher,
    type Logger,
    type ReaderOf,
    type RepositoryOf,
    type UpdaterOf,
} from "@dieti-estates-2025/common";

import "../api/api-locals.js";

import { AuthRegister } from "../auth/auth-register.js";
import { SimpleLoginInteractor } from "../auth/simple-login-interactor.js";
import { SimpleSignupInteractor } from "../auth/simple-signup-interactor.js";
import { ThirdPartyLoginInteractor } from "../auth/third-party-login-interactor.js";
import { ThirdPartySignupInteractor } from "../auth/third-party-signup-interactor.js";
import type {
    HashService,
    LoginPresenter,
    SignupPresenter,
    ThirdPartyAuthService,
    TokenService,
} from "../auth/interfaces.js";

import { CreateNewAdminInteractor } from "../admin/create-new-admin-interactor.js";
import { CreateNewAgentInteractor } from "../admin/create-new-agent-interactor.js";
import { EditAdminPasswordInteractor } from "../admin/edit-admin-password-interactor.js";
import { SetupFirstAdminInteractor } from "../admin/setup-first-admin-interactor.js";
import type {
    CreateNewAdminPresenter,
    CreateNewAgentPresenter,
    EditAdminPasswordPresenter,
    FirstAdminConfig,
    FirstLaunchDetector,
} from "../admin/interfaces.js";

import { CountIncomingOfferInteractor } from "../dashboard/count-incoming-offer-interactor.js";
import { CountIncomingPrenotationInteractor } from "../dashboard/count-incoming-prenotation-interactor.js";
import { CountIncomingViewInteractor } from "../dashboard/count-incoming-view-interactor.js";
import { CreateNewAdvertisementInteractor } from "../dashboard/create-new-advertisement-interactor.js";
import { MarkAsTakenInteractor } from "../dashboard/mark-as-taken-interactor.js";
import { RetrieveAdvertisementsMetricsInteractor } from "../dashboard/retrieve-advertisements-metrics-interactor.js";
import type {
    AdvertisementRepository,
    CreateNewAdvertisementPresenter,
    DetectPOIsService,
    RetrieveAdvertisementsMetricsPresenter,
} from "../dashboard/interfaces.js";
import type {
    AdvertisementData,
    AdvertisementsMetrics,
} from "../dashboard/data-objects.js";

import { BookVisitInteractor } from "../user/book-visit-interactor.js";
import { FilterAdvertisementsInteractor } from "../user/filter-advertisements-interactor.js";
import { MakeOfferInteractor } from "../user/make-offer-interactor.js";
import { ViewAdvertisementInteractor } from "../user/view-advertisement-interactor.js";
import type {
    AdvertisementReader,
    BookVisitPresenter,
    FilterAdvertisementsPresenter,
    MakeOfferPresenter,
    ViewAdvertisementPresenter,
} from "../user/interfaces.js";

import { AdminController } from "../http-adapters/admin-controller.js";
import { AdvertisementController } from "../http-adapters/advertisement-controller.js";
import { AgentController } from "../http-adapters/agent-controller.js";
import { AuthController } from "../http-adapters/auth-controller.js";
import { HTTPBookVisitPresenter } from "../http-adapters/http-book-visit-presenter.js";
import { HTTPCreateNewAdminPresenter } from "../http-adapters/http-create-new-admin-presenter.js";
import { HTTPCreateNewAgentPresenter } from "../http-adapters/http-create-new-agent-presenter.js";
import { HTTPEditAdminPasswordPresenter } from "../http-adapters/http-edit-admin-password-presenter.js";
import { HTTPFilterAdvertisementsPresenter } from "../http-adapters/http-filter-advertisements-presenter.js";
import { HTTPLoginPresenter } from "../http-adapters/http-login-presenter.js";
import { HTTPMakeOfferPresenter } from "../http-adapters/http-make-offer-presenter.js";
import { HTTPSignupPresenter } from "../http-adapters/http-sign-up-presenter.js";
import { HTTPViewAdvertisementPresenter } from "../http-adapters/http-view-advertisement-presenter.js";
import type { ResponseManager } from "../http-adapters/response-manager.js";

import { APIBuilderDirector } from "../api/api-builder.js";
import { ExpressAPIBuilder } from "../api/express-api-builder.js";
import { ExpressRequestBuilder } from "../api/express-request-builder.js";
import { ExpressResponseManager } from "../api/express-response-manager.js";

import { logToConsole } from "../node-logger/log-to-console.js";
import { NodeLogger } from "../node-logger/node-logger.js";

import { PrismaAdvertisementRepository } from "../persistence/advertisement-repository.js";
import { PrismaAuthRepository } from "../persistence/auth-repository.js";
import { PrismaClient } from "../persistence/generated/prisma/client.js";
import { createPrismaClient } from "../persistence/create-prisma-client.js";

import {
    StubCreateNewAdvertisementPresenter,
    StubEventPublisher,
    StubRetrieveAdvertisementsMetricsPresenter,
    StubThirdPartyAuthService,
    StubTokenService,
} from "./stubs.js";
import { databaseConfigFromEnv } from "../persistence/database-config.js";
import {
    AdminCounterFirstLaunchDetector,
    type AdminCounter,
} from "../persistence/first-launch-detector.js";
import { Config } from "./config.js";
import { GeoapifyService } from "../geoapify-services/geoapify-service.js";
import { Argon2HashService } from "../persistence/argon2-hash-service.js";

const prismaClient = await createPrismaClient(databaseConfigFromEnv());

export const container = Container.create()

    //=======================================================================//
    //                                Config                                 //
    //=======================================================================//

    .register("app-config", [], () => new Config())
    .register(
        "first-admin-config",
        ["app-config"],
        (appConfig: Config) => appConfig,
    )

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *                                                                       *
     *                                                                       *
     *                           APPLICATION LAYER                           *
     *                                                                       *
     *                                                                       *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    //=======================================================================//
    //                                 Auth                                  //
    //=======================================================================//

    .register(
        "simple-login-interactor",
        ["auth-register", "login-presenter", "logger"],
        (
            authRegister: AuthRegister,
            loginPresenter: LoginPresenter,
            logger: Logger,
        ) => new SimpleLoginInteractor(authRegister, loginPresenter, logger),
    )
    .register(
        "simple-signup-interactor",
        ["auth-register", "signup-presenter", "logger"],
        (
            authRegister: AuthRegister,
            signupPresenter: SignupPresenter,
            logger: Logger,
        ) => new SimpleSignupInteractor(authRegister, signupPresenter, logger),
    )
    .register(
        "third-party-login-interactor",
        ["auth-register", "login-presenter", "logger"],
        (
            authRegister: AuthRegister,
            loginPresenter: LoginPresenter,
            logger: Logger,
        ) =>
            new ThirdPartyLoginInteractor(authRegister, loginPresenter, logger),
    )
    .register(
        "third-party-signup-interactor",
        ["auth-register", "signup-presenter", "logger"],
        (
            authRegister: AuthRegister,
            signupPresenter: SignupPresenter,
            logger: Logger,
        ) =>
            new ThirdPartySignupInteractor(
                authRegister,
                signupPresenter,
                logger,
            ),
    )
    .register(
        "auth-register",
        [
            "token-service",
            "third-party-auth-service",
            "password-repository",
            "user-repository",
            "sub-repository",
            "hash-service",
        ],
        (
            tokenService: TokenService,
            thirdPartyAuthService: ThirdPartyAuthService,
            passwordRepository: RepositoryOf<"Password", string, User>,
            userRepository: RepositoryOf<"User", User, { email: string }>,
            subRepository: RepositoryOf<
                "Sub",
                User,
                { sub: string; provider: string }
            >,
            hashService: HashService,
        ) =>
            new AuthRegister(
                tokenService,
                thirdPartyAuthService,
                passwordRepository,
                userRepository,
                subRepository,
                hashService,
            ),
    )

    //=======================================================================//
    //                                   Admin                               //
    //=======================================================================//

    .register(
        "create-new-admin-interactor",
        [
            "create-new-admin-presenter",
            "admin-creator",
            "password-repository",
            "logger",
        ],
        (
            createNewAdminPresenter: CreateNewAdminPresenter,
            adminCreator: CreatorOf<"Admin", Admin, { username: string }>,
            passwordRepository: RepositoryOf<"Password", string, User>,
            logger: Logger,
        ) =>
            new CreateNewAdminInteractor(
                createNewAdminPresenter,
                adminCreator,
                passwordRepository,
                logger,
            ),
    )
    .register(
        "create-new-agent-interactor",
        [
            "create-new-agent-presenter",
            "agent-creator",
            "password-repository",
            "logger",
        ],
        (
            createNewAgentPresenter: CreateNewAgentPresenter,
            agentCreator: CreatorOf<"Agent", Agent, { username: string }>,
            passwordRepository: RepositoryOf<"Password", string, User>,
            logger: Logger,
        ) =>
            new CreateNewAgentInteractor(
                createNewAgentPresenter,
                agentCreator,
                passwordRepository,
                logger,
            ),
    )
    .register(
        "edit-admin-password-interactor",
        ["edit-admin-password-presenter", "admin-password-editor", "logger"],
        (
            editAdminPasswordPresenter: EditAdminPasswordPresenter,
            adminPasswordEditor: UpdaterOf<
                "password",
                string,
                { username: string }
            >,
            logger: Logger,
        ) =>
            new EditAdminPasswordInteractor(
                editAdminPasswordPresenter,
                adminPasswordEditor,
                logger,
            ),
    )
    .register(
        "setup-first-admin-interactor",
        [
            "first-admin-config",
            "first-launch-detector",
            "admin-creator",
            "password-repository",
            "logger",
        ],
        (
            config: FirstAdminConfig,
            detector: FirstLaunchDetector,
            adminCreator: CreatorOf<"Admin", Admin, { email: string }>,
            passwordRepository: RepositoryOf<"Password", string, User>,
            logger: Logger,
        ) =>
            new SetupFirstAdminInteractor(
                config,
                detector,
                adminCreator,
                passwordRepository,
                logger,
            ),
    )

    //=======================================================================//
    //                               Dashboard                               //
    //=======================================================================//

    .register(
        "create-new-advertisement-interactor",
        [
            "detect-pois-service",
            "create-new-advertisement-presenter",
            "advertisement-repository",
            "logger",
        ],
        (
            detectPOIsService: DetectPOIsService,
            presenter: CreateNewAdvertisementPresenter,
            repository: AdvertisementRepository,
            logger: Logger,
        ) =>
            new CreateNewAdvertisementInteractor(
                detectPOIsService,
                presenter,
                repository,
                logger,
            ),
    )
    .register(
        "retrieve-advertisements-metrics-interactor",
        [
            "retrieve-advertisements-metrics-presenter",
            "advertisement-metrics-reader",
            "logger",
        ],
        (
            presenter: RetrieveAdvertisementsMetricsPresenter,
            metricsReader: ReaderOf<
                "AdvertisementMetrics",
                AdvertisementsMetrics,
                null
            >,
            logger: Logger,
        ) =>
            new RetrieveAdvertisementsMetricsInteractor(
                presenter,
                metricsReader,
                logger,
            ),
    )
    .register(
        "count-incoming-offer-interactor",
        ["advertisement-data-repository", "logger"],
        (
            repository: ReaderOf<
                "AdvertisementData",
                AdvertisementData,
                { id: number }
            > &
                UpdaterOf<
                    "AdvertisementData",
                    AdvertisementData,
                    { id: number }
                >,
            logger: Logger,
        ) => new CountIncomingOfferInteractor(repository, logger),
    )
    .register(
        "count-incoming-view-interactor",
        ["advertisement-data-repository", "logger"],
        (
            repository: ReaderOf<
                "AdvertisementData",
                AdvertisementData,
                { id: number }
            > &
                UpdaterOf<
                    "AdvertisementData",
                    AdvertisementData,
                    { id: number }
                >,
            logger: Logger,
        ) => new CountIncomingViewInteractor(repository, logger),
    )
    .register(
        "count-incoming-prenotation-interactor",
        ["advertisement-data-repository", "logger"],
        (
            repository: ReaderOf<
                "AdvertisementData",
                AdvertisementData,
                { id: number }
            > &
                UpdaterOf<
                    "AdvertisementData",
                    AdvertisementData,
                    { id: number }
                >,
            logger: Logger,
        ) => new CountIncomingPrenotationInteractor(repository, logger),
    )
    .register(
        "mark-as-taken-interactor",
        ["advertisement-repository", "logger"],
        (repository: AdvertisementRepository, logger: Logger) =>
            new MarkAsTakenInteractor(repository, logger),
    )

    //=======================================================================//
    //                                  User                                 //
    //=======================================================================//

    .register(
        "view-advertisement-interactor",
        [
            "event-publisher",
            "view-advertisement-presenter",
            "advertisement-reader",
            "logger",
        ],
        (
            publisher: EventPublisher,
            presenter: ViewAdvertisementPresenter,
            reader: ReaderOf<"Advertisement", Advertisement, { id: number }>,
            logger: Logger,
        ) =>
            new ViewAdvertisementInteractor(
                publisher,
                presenter,
                reader,
                logger,
            ),
    )
    .register(
        "filter-advertisements-interactor",
        ["advertisement-reader", "filter-advertisements-presenter", "logger"],
        (
            reader: AdvertisementReader,
            presenter: FilterAdvertisementsPresenter,
            logger: Logger,
        ) => new FilterAdvertisementsInteractor(reader, presenter, logger),
    )
    .register(
        "make-offer-interactor",
        [
            "event-publisher",
            "make-offer-presenter",
            "advertisement-reader",
            "logger",
        ],
        (
            publisher: EventPublisher,
            presenter: MakeOfferPresenter,
            reader: ReaderOf<"Advertisement", Advertisement, { id: number }>,
            logger: Logger,
        ) => new MakeOfferInteractor(publisher, presenter, reader, logger),
    )
    .register(
        "book-visit-interactor",
        [
            "event-publisher",
            "book-visit-presenter",
            "advertisement-reader",
            "logger",
        ],
        (
            publisher: EventPublisher,
            presenter: BookVisitPresenter,
            reader: ReaderOf<"Advertisement", Advertisement, number>,
            logger: Logger,
        ) => new BookVisitInteractor(publisher, presenter, reader, logger),
    )

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *                                                                       *
     *                                                                       *
     *                              ADAPTER LAYER                            *
     *                                                                       *
     *                                                                       *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    //=======================================================================//
    //              Request-scoped Express wrappers (factories)              //
    //=======================================================================//

    .register(
        "response-manager",
        ["express-response"],
        (res: ExpressResponse) => new ExpressResponseManager(res),
    )
    .register(
        "request-builder",
        ["express-request"],
        (req: ExpressRequest) => new ExpressRequestBuilder(req),
    )

    //=======================================================================//
    //                          HTTP Presenters                              //
    //=======================================================================//

    .register(
        "login-presenter",
        ["response-manager", "logger"],
        (responseManager: ResponseManager, logger: Logger) =>
            new HTTPLoginPresenter(responseManager, logger),
    )
    .register(
        "signup-presenter",
        ["response-manager", "logger"],
        (responseManager: ResponseManager, logger: Logger) =>
            new HTTPSignupPresenter(responseManager, logger),
    )
    .register(
        "create-new-admin-presenter",
        ["response-manager", "logger"],
        (responseManager: ResponseManager, logger: Logger) =>
            new HTTPCreateNewAdminPresenter(responseManager, logger),
    )
    .register(
        "create-new-agent-presenter",
        ["response-manager", "logger"],
        (responseManager: ResponseManager, logger: Logger) =>
            new HTTPCreateNewAgentPresenter(responseManager, logger),
    )
    .register(
        "edit-admin-password-presenter",
        ["response-manager", "logger"],
        (responseManager: ResponseManager, logger: Logger) =>
            new HTTPEditAdminPasswordPresenter(responseManager, logger),
    )
    .register(
        "filter-advertisements-presenter",
        ["response-manager", "logger"],
        (responseManager: ResponseManager, logger: Logger) =>
            new HTTPFilterAdvertisementsPresenter(responseManager, logger),
    )
    .register(
        "view-advertisement-presenter",
        ["response-manager", "logger"],
        (responseManager: ResponseManager, logger: Logger) =>
            new HTTPViewAdvertisementPresenter(responseManager, logger),
    )
    .register(
        "make-offer-presenter",
        ["response-manager", "logger"],
        (responseManager: ResponseManager, logger: Logger) =>
            new HTTPMakeOfferPresenter(responseManager, logger),
    )
    .register(
        "book-visit-presenter",
        ["response-manager", "logger"],
        (responseManager: ResponseManager, logger: Logger) =>
            new HTTPBookVisitPresenter(responseManager, logger),
    )

    //=======================================================================//
    //                          HTTP Controllers                             //
    //=======================================================================//

    .register(
        "auth-controller",
        [
            "simple-login-interactor",
            "simple-signup-interactor",
            "third-party-login-interactor",
            "third-party-signup-interactor",
            "response-manager",
            "logger",
        ],
        (
            simpleLogin: SimpleLoginInteractor,
            simpleSignup: SimpleSignupInteractor,
            thirdPartyLogin: ThirdPartyLoginInteractor,
            thirdPartySignup: ThirdPartySignupInteractor,
            responseManager: ResponseManager,
            logger: Logger,
        ) =>
            new AuthController(
                simpleLogin,
                simpleSignup,
                thirdPartyLogin,
                thirdPartySignup,
                responseManager,
                logger,
            ),
    )
    .register(
        "admin-controller",
        [
            "create-new-admin-interactor",
            "edit-admin-password-interactor",
            "response-manager",
            "token-service",
            "logger",
        ],
        (
            createNewAdmin: CreateNewAdminInteractor,
            editAdminPassword: EditAdminPasswordInteractor,
            responseManager: ResponseManager,
            tokenService: TokenService,
            logger: Logger,
        ) =>
            new AdminController(
                createNewAdmin,
                editAdminPassword,
                responseManager,
                tokenService,
                logger,
            ),
    )
    .register(
        "advertisement-controller",
        [
            "view-advertisement-interactor",
            "filter-advertisements-interactor",
            "make-offer-interactor",
            "book-visit-interactor",
            "create-new-advertisement-interactor",
            "retrieve-advertisements-metrics-interactor",
            "count-incoming-offer-interactor",
            "count-incoming-view-interactor",
            "mark-as-taken-interactor",
            "count-incoming-prenotation-interactor",
            "response-manager",
            "logger",
        ],
        (
            view: ViewAdvertisementInteractor,
            filter: FilterAdvertisementsInteractor,
            makeOffer: MakeOfferInteractor,
            bookVisit: BookVisitInteractor,
            createNew: CreateNewAdvertisementInteractor,
            retrieveMetrics: RetrieveAdvertisementsMetricsInteractor,
            countOffer: CountIncomingOfferInteractor,
            countView: CountIncomingViewInteractor,
            markAsTaken: MarkAsTakenInteractor,
            countPrenotation: CountIncomingPrenotationInteractor,
            responseManager: ResponseManager,
            logger: Logger,
        ) =>
            new AdvertisementController(
                view,
                filter,
                makeOffer,
                bookVisit,
                createNew,
                retrieveMetrics,
                countOffer,
                countView,
                markAsTaken,
                countPrenotation,
                responseManager,
                logger,
            ),
    )
    .register(
        "agent-controller",
        ["create-new-agent-interactor", "response-manager", "logger"],
        (
            createNewAgent: CreateNewAgentInteractor,
            responseManager: ResponseManager,
            logger: Logger,
        ) => new AgentController(createNewAgent, responseManager, logger),
    )

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *                                                                       *
     *                                                                       *
     *                          INFRASTRUCTURE LAYER                         *
     *                                                                       *
     *                                                                       *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    //=======================================================================//
    //                                Logger                                 //
    //=======================================================================//

    .register("logger", [], () => {
        const logger = new NodeLogger();
        logger.on("error", logToConsole);
        logger.on("warn", logToConsole);
        logger.on("info", logToConsole);
        logger.on("debug", logToConsole);
        return logger;
    })

    //=======================================================================//
    //                              Persistence                              //
    //=======================================================================//

    .register("prisma-client", [], () => prismaClient)
    .register(
        "auth-repository",
        ["prisma-client", "hash-service", "logger"],
        (prisma: PrismaClient, hashService: HashService, logger: Logger) =>
            new PrismaAuthRepository(prisma, hashService, logger),
    )
    .register(
        "user-repository",
        ["auth-repository"],
        (repo: PrismaAuthRepository) => repo,
    )
    .register(
        "password-repository",
        ["auth-repository"],
        (repo: PrismaAuthRepository) => repo,
    )
    .register(
        "sub-repository",
        ["auth-repository"],
        (repo: PrismaAuthRepository) => repo,
    )
    .register(
        "admin-creator",
        ["auth-repository"],
        (repo: PrismaAuthRepository) => repo,
    )
    .register(
        "agent-creator",
        ["auth-repository"],
        (repo: PrismaAuthRepository) => repo,
    )
    .register(
        "admin-password-editor",
        ["auth-repository"],
        (repo: PrismaAuthRepository) => repo,
    )
    .register(
        "advertisement-repository",
        ["prisma-client", "logger"],
        (prisma: PrismaClient, logger: Logger) =>
            new PrismaAdvertisementRepository(prisma, logger),
    )
    .register(
        "advertisement-reader",
        ["advertisement-repository"],
        (repo: PrismaAdvertisementRepository) => repo,
    )
    .register(
        "advertisement-data-repository",
        ["advertisement-repository"],
        (repo: PrismaAdvertisementRepository) => repo,
    )
    .register(
        "advertisement-metrics-reader",
        ["advertisement-repository"],
        (repo: PrismaAdvertisementRepository) => repo,
    )
    .register(
        "first-launch-detector",
        ["admin-counter"],
        (adminCounter: AdminCounter) =>
            new AdminCounterFirstLaunchDetector(adminCounter),
    )
    .register(
        "admin-counter",
        ["auth-repository"],
        (repo: PrismaAuthRepository) => repo,
    )

    //=======================================================================//
    //                            Service Stubs                              //
    //=======================================================================//

    .register("token-service", [], () => new StubTokenService())
    .register("hash-service", [], () => new Argon2HashService())
    .register(
        "third-party-auth-service",
        [],
        () => new StubThirdPartyAuthService(),
    )
    .register("event-publisher", [], () => new StubEventPublisher())
    .register("detect-pois-service", [], () => new GeoapifyService())
    .register(
        "create-new-advertisement-presenter",
        [],
        () => new StubCreateNewAdvertisementPresenter(),
    )
    .register(
        "retrieve-advertisements-metrics-presenter",
        [],
        () => new StubRetrieveAdvertisementsMetricsPresenter(),
    )

    //=======================================================================//
    //                                  API                                  //
    //=======================================================================//

    .register("express-app", [], () => {
        const app = express();
        app.use(express.json());
        return app;
    })
    .register(
        "api-builder",
        ["express-app"],
        (app: express.Express) => new ExpressAPIBuilder(app),
    )
    .register("api-builder-director", [], () => new APIBuilderDirector());

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                          PER-REQUEST DI MIDDLEWARE                        *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const diMiddleware = (
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction,
): void => {
    const scoped = container
        .register("express-request", [], () => req)
        .register("express-response", [], () => res);
    req.authController = scoped.get("auth-controller");
    req.adminController = scoped.get("admin-controller");
    req.advertisementController = scoped.get("advertisement-controller");
    req.agentController = scoped.get("agent-controller");
    next();
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                               PREBOOTSTRAP                                *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

await container.get("setup-first-admin-interactor").execute();

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                                 BOOTSTRAP                                 *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const app = container.get("express-app");
app.use(diMiddleware);
const apiBuilder = container.get("api-builder");
const apiDirector = container.get("api-builder-director");
const api = apiDirector.makeAPI(apiBuilder);
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
api.start(port);
