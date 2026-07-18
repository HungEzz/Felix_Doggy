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

  // Serve raw spec as JSON for programmatic access
  app.get('/api-docs/spec.json', (_req, res) => {
    res.json(swaggerDocument);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
}
