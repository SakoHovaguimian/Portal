import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import titleCaseRule from './scripts/eslint/title-case-rule.mjs';
import blockLayoutRule from './scripts/eslint/block-layout-rule.mjs';
import constructorLayoutRule from './scripts/eslint/constructor-layout-rule.mjs';
import interfaceLayoutRule from './scripts/eslint/interface-layout-rule.mjs';
import namedReturnRule from './scripts/eslint/named-return-rule.mjs';
import serviceMarkRule from './scripts/eslint/service-mark-rule.mjs';
import zodEnumLayoutRule from './scripts/eslint/zod-enum-layout-rule.mjs';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    plugins: {
      portal: {
        rules: {
          'block-layout': blockLayoutRule,
          'constructor-layout': constructorLayoutRule,
          'interface-layout': interfaceLayoutRule,
          'named-return': namedReturnRule,
          'service-mark': serviceMarkRule,
          'zod-enum-layout': zodEnumLayoutRule,
        },
      },
    },
    rules: {
      curly: ['error', 'all'],
      'import/first': 'error',
      'react/jsx-indent-props': ['error', 2],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'block-spacing': ['error', 'always'],
      'keyword-spacing': 'error',
      'space-before-function-paren': [
        'error',
        { anonymous: 'always', named: 'never', asyncArrow: 'always' },
      ],
      'space-infix-ops': 'error',
      'comma-spacing': 'error',
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'ignore',
        },
      ],
      'func-call-spacing': ['error', 'never'],
      'key-spacing': 'error',
      indent: ['error', 2, { SwitchCase: 1 }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'never', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: 'export', next: 'export' },
        { blankLine: 'always', prev: ['function', 'class'], next: '*' },
        { blankLine: 'always', prev: '*', next: ['function', 'class'] },
      ],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'eol-last': ['error', 'always'],
      'linebreak-style': ['error', 'unix'],
      'portal/block-layout': 'error',
      'portal/constructor-layout': 'error',
      'portal/interface-layout': 'error',
      'portal/named-return': 'error',
      'portal/service-mark': 'error',
      'portal/zod-enum-layout': 'error',
    },
  },
  {
    files: ['src/strings.ts'],
    plugins: { copy: { rules: { 'title-case': titleCaseRule } } },
    rules: { 'copy/title-case': 'error' },
  },
  globalIgnores(['.next/**', 'node_modules/**', 'next-env.d.ts']),
]);
