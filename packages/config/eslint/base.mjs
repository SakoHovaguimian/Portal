import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', '.next/**', 'coverage/**', 'generated/**', 'node_modules/**', 'tests/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  // Layer boundary enforcement rules
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@semantic-web/api-sdk/src/repositories/*'],
              message:
                'Do not import repositories directly. Use services via useServiceContainer() instead.',
            },
            {
              group: ['@semantic-web/api-sdk/src/client/*'],
              message:
                'Do not import API clients directly. Use services via useServiceContainer() instead.',
            },
          ],
        },
      ],
    },
  },
  // Feature isolation rules using eslint-plugin-boundaries
  {
    files: ['apps/web/features/**/*.{ts,tsx}'],
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        { type: 'feature', pattern: 'apps/web/features/*' },
        { type: 'lib', pattern: 'apps/web/lib/*' },
        { type: 'providers', pattern: 'apps/web/providers/*' },
        { type: 'components', pattern: 'apps/web/components/*' },
        { type: 'packages', pattern: 'packages/*' },
      ],
      'boundaries/ignore': ['**/*.test.ts', '**/*.test.tsx'],
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'allow',
          rules: [
            {
              // Features can import from lib, providers, components, and packages
              from: ['feature'],
              allow: ['lib', 'providers', 'components', 'packages'],
            },
          ],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@semantic-web/api-sdk/src/repositories/*'],
              message:
                'Do not import repositories directly. Use services via useServiceContainer() instead.',
            },
            {
              group: ['@semantic-web/api-sdk/src/client/*'],
              message:
                'Do not import API clients directly. Use services via useServiceContainer() instead.',
            },
            {
              group: ['../auth/*', '../dashboard/*', '../users/*', '../feature-requests/*', '../settings/*', '../experience/*'],
              message:
                'Features should not import from other features. Use the feature barrel export or extract shared code to lib/.',
            },
            {
              group: ['../../features/auth/*', '../../features/dashboard/*', '../../features/users/*', '../../features/feature-requests/*', '../../features/settings/*', '../../features/experience/*'],
              message:
                'Features should not import from other features. Use the feature barrel export or extract shared code to lib/.',
            },
          ],
        },
      ],
    },
  },
];
