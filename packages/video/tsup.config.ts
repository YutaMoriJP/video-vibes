import { defineConfig } from 'tsup';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    resolve: true,
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  noExternal: ['zustand', 'clsx'],
  onSuccess: async () => {
    // Add .js extensions to ESM imports for proper Node.js ESM compliance
    const esmPath = './dist/index.js';
    const content = readFileSync(esmPath, 'utf-8');
    const updated = content.replace(
      /from ['"]\.\/(.+?)(['"])/g,
      (match, path, quote) => {
        // Only add .js if it doesn't already end with .js or have an extension
        if (!path.endsWith('.js') && !path.includes('.')) {
          return `from '${path}.js'${quote}`;
        }
        return match;
      }
    );
    writeFileSync(esmPath, updated);
  },
});
