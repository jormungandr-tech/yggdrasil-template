import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: [
    './src/infrastructure/schema/production.ts'
  ],
  out: './migration',
  dialect: 'postgresql',
});