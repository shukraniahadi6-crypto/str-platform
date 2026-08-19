/**
 * swagger-ui-config.ts
 * Configures and mounts Swagger UI on an Express application.
 * Usage: import and call setupSwaggerUi(app) after defining routes.
 */

import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const SPEC_PATH = path.resolve(__dirname, "openapi.yaml");

export function setupSwaggerUi(app: Express): void {
  const swaggerDocument = YAML.load(SPEC_PATH);

  const options: swaggerUi.SwaggerUiOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "list",
      filter: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: "STR Platform API Docs",
    customCss: `
      .swagger-ui .topbar { background-color: #1a1a2e; }
      .swagger-ui .topbar-wrapper .link { display: none; }
    `,
  };

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

  // Serve raw spec for SDK generation tools
  app.get("/api-docs/openapi.yaml", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/x-yaml");
    res.sendFile(SPEC_PATH);
  });

  app.get("/api-docs/openapi.json", (_req: Request, res: Response) => {
    res.json(swaggerDocument);
  });
}
