import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/is-valid-email.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
});
