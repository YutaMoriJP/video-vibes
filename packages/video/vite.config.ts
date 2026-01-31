import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import typescript from '@rollup/plugin-typescript';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VideoPlayer',
      fileName: 'video-player',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      plugins: [
        typescript({
          tsconfig: './tsconfig.json',
          noEmitOnError: false,
        }),
      ],
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
