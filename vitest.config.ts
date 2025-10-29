import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['**/*.test.{ts,tsx}'],
    testTimeout: 3000, // Maximum 3 seconds per test - much shorter
    hookTimeout: 1000, // Maximum 1 second for hooks - much shorter
    coverage: {
      provider: 'v8',
      include: [
        'helpers/**/*.{ts,tsx}',
        'src/**/*.{ts,tsx}',
      ],
      exclude: [
        'src/**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/node_modules/**',
        'coverage/**',
      ],
      reporter: ['text', 'lcov', 'html'],
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src'),
      'helpers': path.resolve(__dirname, './helpers'),
    },
  },
})
