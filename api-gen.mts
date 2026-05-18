import { codegen } from "swagger-axios-codegen";
import spec from "./backend/openapi.json" with { type: "json" };

codegen({
    methodNameMode: "operationId",
    source: spec,
    outputDir: "./frontend/api/generated",
});
