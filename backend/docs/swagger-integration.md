# Swagger UI Integration Guide for Express

## 1. Install Dependencies

```bash
npm install swagger-ui-express yaml
npm install -D @types/swagger-ui-express
```

> `swagger-ui-express` serves the Swagger UI at a route.
> `yaml` parses the YAML spec file at runtime.

## 2. Create Swagger Config

Create `src/config/swagger.ts`:

```typescript
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { Express } from 'express';

export function setupSwagger(app: Express): void {
  const specPath = path.resolve(__dirname, '../../docs/openapi.yaml');
  const specFile = fs.readFileSync(specPath, 'utf8');
  const swaggerDocument = YAML.parse(specFile);

  const options: swaggerUi.SwaggerUiOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Felix Doggy API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

  // Serve raw spec as JSON for programmatic access
  app.get('/api-docs/spec.json', (_req, res) => {
    res.json(swaggerDocument);
  });
}
```

## 3. Mount in app.ts

Add the import and call near your existing route registrations in `src/app.ts`:

```typescript
import { setupSwagger } from './config/swagger';

// ... existing middleware ...

// Swagger UI — mount BEFORE API routes to avoid rate limiter interference
if (process.env.NODE_ENV !== 'production') {
  setupSwagger(app);
}

// ... existing route registrations ...
```

## 4. Access

After starting the dev server:

| URL                              | Purpose                    |
|----------------------------------|----------------------------|
| `http://localhost:3000/api-docs`  | Interactive Swagger UI     |
| `http://localhost:3000/api-docs/spec.json` | Raw OpenAPI JSON   |

## 5. Using the Authorize Button

1. Click the **Authorize** 🔓 button in Swagger UI.
2. Enter your JWT token (without the `Bearer ` prefix — Swagger adds it).
3. Click **Authorize** → **Close**.
4. All subsequent "Try it out" requests will include the token.

## 6. Production Considerations

- **Disable in production**: The example above uses `NODE_ENV !== 'production'`.
  If you want docs in production, consider basic auth protection:

  ```typescript
  import basicAuth from 'express-basic-auth';

  app.use('/api-docs', basicAuth({
    users: { 'admin': process.env.DOCS_PASSWORD || 'changeme' },
    challenge: true,
  }), swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
  ```

- **Keep spec in sync**: The YAML file is the single source of truth. When
  routes change, update `docs/openapi.yaml` accordingly.

## 7. Validate the Spec

You can lint the spec with:

```bash
npx @redocly/cli lint docs/openapi.yaml
```
