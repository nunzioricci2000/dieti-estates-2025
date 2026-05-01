import type { APIBuilder } from "./api-builder.js";
import { ExpressAPI } from "./express-api.js";
import { 
    type Express, 
    type Request as ExpressRequest 
} from "express";
import { ExpressRequestBuilder } from "./express-request-builder.js";
import session from "express-session";
import {
    type Request,
    RequestBuilderDirector,
} from "@dieti-estates-2025/common";
import { 
    discovery, 
    buildAuthorizationUrl, 
    randomState, randomPKCECodeVerifier, 
    calculatePKCECodeChallenge 
} from 'openid-client';


export class ExpressAPIBuilder implements APIBuilder<ExpressAPI> {
    private requestBuilderDirector = new RequestBuilderDirector();

    constructor(private app: Express) { 
        app.use(session({
            secret: process.env.SESSION_SECRET!,
            resave: false,
            saveUninitialized: false,
        }))
    }

    private buildRequest(req: ExpressRequest): Request {
        const requestBuilder = new ExpressRequestBuilder(req);
        return this.requestBuilderDirector.makeRequest(requestBuilder);
    }

    buildAuthRouter(): void {
        this.app.post("/auth/signup", (req, _, next) => {
            req.authController.signup(this.buildRequest(req));
            next();
        });
        this.app.post("/auth/login", (req, _, next) => {
            req.authController.login(this.buildRequest(req));
            next();
        });

        this.app.get('/auth/google/:operation', async (req, res) => {
            const operation = req.params.operation;
            if(operation != "signup" && operation != "login") {
                return res.status(404).json({error: "not found"});
            }
            // 1. Discover Google's OIDC configuration (endpoints, supported features, etc.)
            //    This fetches https://accounts.google.com/.well-known/openid-configuration
            const config = await discovery(
                new URL('https://accounts.google.com'),
                process.env.GOOGLE_CLIENT_ID!,
                process.env.GOOGLE_CLIENT_SECRET!
            );

            // 2. Generate security parameters
            const state = randomState();
            const codeVerifier = randomPKCECodeVerifier();
            const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);

            // 3. Persist them in the session so the callback endpoint can verify them
            req.session.oauthState = state;
            req.session.codeVerifier = codeVerifier;
            req.session.operation = operation;

            // 4. Build the authorization URL with your requested scopes
            const redirectUrl = buildAuthorizationUrl(config, {
                redirect_uri: process.env.GOOGLE_REDIRECT_URI!, // must match what you registered
                scope: operation == 'signup' ? 'openid email profile' : 'openid',
                state,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256',
            });

            res.redirect(redirectUrl.href);
        });

        this.app.get('/auth/github/:operation', async (req, res) => {
            const operation = req.params.operation;
            if(operation != 'signup' && operation != 'login') {
                return res.status(400).json({error: "not found"});
            }
            const state = randomState();
            req.session.oauthState = state;
            req.session.operation = operation;

            const params = new URLSearchParams({
                client_id: process.env.GITHUB_CLIENT_ID!,
                redirect_uri: process.env.GITHUB_REDIRECT_URI!,
                scope: operation == 'signup' ? 'read:user user:email' : 'read:user',
                state,
            });

            res.redirect(`https://github.com/login/oauth/authorize?${params}`);
        });

        this.app.get('/auth/google/callback', async (req, res) => {
            const state = req.session.oauthState;
            const codeVerifier = req.session.codeVerifier;
            const operation = req.session.operation;
            req.headers.state = state;
            req.headers.codeVerifier = codeVerifier;

            // Build the full URL object openid-client needs
            const callbackUrl = new URL(
                req.originalUrl,
                `http://${process.env.IP}:${process.env.PORT}`
            );

            operation == 'signup' ? req.authController.thirdPartySignup(
                this.buildRequest(req),
            ) : req.authController.thirdPartyLogin(
                this.buildRequest(req),
            );
        });

        this.app.get('/auth/github/callback', async (req, res) => {
            const { code, state } = req.query;
            const operation = req.session.operation;
            req.headers.codeVerifier = code?.toString();

            // Manually verify state to prevent CSRF
            if (!state || state !== req.session.oauthState) {
                return res.status(403).json({ error: 'Invalid state parameter' });
            }

            // Clear state from session — it's single use
            req.session.oauthState = undefined;


            operation == 'signup' ? req.authController.thirdPartySignup(
                this.buildRequest(req),
            ) : req.authController.thirdPartyLogin(
                this.buildRequest(req),
            );
            
        });
    }

    buildAdvertisementRouter(): void {
        this.app.get("/advertisements", (req, _, next) => {
            req.advertisementController.getAdvertisements(
                this.buildRequest(req),
            );
            next();
        });
        this.app.get("/advertisements/:id", (req, _, next) => {
            req.advertisementController.getAdvertisement(
                this.buildRequest(req),
            );
            next();
        });
        this.app.post("/advertisements/:id/offers", (req, _, next) => {
            req.advertisementController.postOffer(this.buildRequest(req));
            next();
        });
        this.app.post("/advertisements", (req, _, next) => {
            req.advertisementController.postAdvertisement(
                this.buildRequest(req),
            );
            next();
        });
        this.app.patch("/advertisements/:id", (req, _, next) => {
            req.advertisementController.patchAdvertisement(
                this.buildRequest(req),
            );
            next();
        });
    }

    buildAdminRouter(): void {
        this.app.post("/admins", (req, _, next) => {
            req.adminController.postAdmin(this.buildRequest(req));
            next();
        });
        this.app.patch("/admins", (req, _, next) => {
            req.adminController.patchAdmin(this.buildRequest(req));
            next();
        });
    }

    buildAgentRouter(): void {
        this.app.post("/agents", (req, _, next) => {
            req.agentController.postAgent(this.buildRequest(req));
            next();
        });
    }

    getResult(): ExpressAPI {
        return new ExpressAPI(this.app);
    }
}
