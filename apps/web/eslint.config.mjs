import { FlatCompat } from '@eslint/eslintrc';
import base from '../../packages/config/eslint/base.mjs';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [...base, ...compat.extends('next/core-web-vitals')];
