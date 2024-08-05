import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infrastructure/schema/*.ts',
  out: './migration',
  dialect: 'postgresql',
});