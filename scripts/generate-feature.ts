#!/usr/bin/env npx tsx
/**
 * Feature Generator Script
 *
 * Generates all the boilerplate files needed for a new feature module,
 * following the architecture patterns established in this template.
 *
 * Usage:
 *   pnpm generate:feature <feature-name>
 *
 * Example:
 *   pnpm generate:feature user-settings
 *   pnpm generate:feature blog-posts
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Utilities
// ============================================================================

function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`  Created directory: ${dirPath}`);
  }
}

function writeFile(filePath: string, content: string): void {
  if (fs.existsSync(filePath)) {
    console.log(`  Skipped (exists): ${filePath}`);
    return;
  }
  fs.writeFileSync(filePath, content);
  console.log(`  Created: ${filePath}`);
}

function appendToFile(filePath: string, marker: string, content: string): void {
  if (!fs.existsSync(filePath)) {
    console.log(`  Warning: File not found for append: ${filePath}`);
    return;
  }
  const existing = fs.readFileSync(filePath, 'utf-8');
  if (existing.includes(content.trim().split('\n')[0])) {
    console.log(`  Skipped (already present): ${filePath}`);
    return;
  }
  // Append before the end of file
  const updated = existing.trimEnd() + '\n\n' + content;
  fs.writeFileSync(filePath, updated);
  console.log(`  Updated: ${filePath}`);
}

// ============================================================================
// Template Generators
// ============================================================================

function generateModel(pascalName: string, camelName: string): string {
  return `import { z } from 'zod';

export const ${pascalName}Schema = z.object({
  id: z.string().uuid(),
  // TODO: Add your entity fields here
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deleted: z.boolean().default(false),
});

export const ${pascalName}MutationInputSchema = z.object({
  // TODO: Add mutation input fields (subset of entity fields)
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});

export type ${pascalName} = z.infer<typeof ${pascalName}Schema>;
export type ${pascalName}MutationInput = z.infer<typeof ${pascalName}MutationInputSchema>;
`;
}

function generateQueryExtension(pascalName: string, camelName: string): string {
  return `
// Add to packages/core/src/models/query.ts:

export const ${pascalName}QuerySchema = PaginationSchema.extend({
  query: z.string().optional(),
});

export type ${pascalName}Query = z.infer<typeof ${pascalName}QuerySchema>;
`;
}

function generateRepositoryInterface(pascalName: string, camelName: string): string {
  return `
// Add to packages/core/src/repositories/interfaces.ts:

export interface ${pascalName}RepositoryInterface {
  list${pascalName}s(query: ${pascalName}Query): Promise<PaginatedResult<${pascalName}>>;
  get${pascalName}ById(${camelName}Id: string): Promise<${pascalName} | null>;
  create${pascalName}(userId: string, input: ${pascalName}MutationInput): Promise<${pascalName}>;
  update${pascalName}(${camelName}Id: string, userId: string, input: ${pascalName}MutationInput): Promise<${pascalName}>;
  delete${pascalName}(${camelName}Id: string, userId: string): Promise<void>;
}
`;
}

function generateServiceInterface(pascalName: string, camelName: string): string {
  return `
// Add to packages/core/src/services/interfaces.ts:

export interface ${pascalName}ServiceInterface {
  list${pascalName}s(query: ${pascalName}Query): Promise<PaginatedResult<${pascalName}>>;
  get${pascalName}ById(${camelName}Id: string): Promise<${pascalName}>;
  create${pascalName}(input: ${pascalName}MutationInput): Promise<${pascalName}>;
  update${pascalName}(${camelName}Id: string, input: ${pascalName}MutationInput): Promise<${pascalName}>;
  delete${pascalName}(${camelName}Id: string): Promise<void>;
}
`;
}

function generateServiceImplementation(pascalName: string, camelName: string): string {
  return `
// Add to packages/core/src/services/implementations.ts:

export class ${pascalName}Service implements ${pascalName}ServiceInterface {
  constructor(
    private readonly repository: ${pascalName}RepositoryInterface,
    private readonly authService: AuthServiceInterface,
  ) {}

  async list${pascalName}s(query: ${pascalName}Query) {
    const validated = validateInput(${pascalName}QuerySchema, query);
    const session = await this.authService.assertAuthenticated();
    return this.repository.list${pascalName}s({ ...validated, userId: session.user.id });
  }

  async get${pascalName}ById(${camelName}Id: string) {
    const session = await this.authService.assertAuthenticated();
    const ${camelName} = await this.repository.get${pascalName}ById(${camelName}Id);
    if (!${camelName}) {
      throw new NotFoundError('${pascalName} not found');
    }
    // TODO: Add ownership check if needed
    return ${camelName};
  }

  async create${pascalName}(input: ${pascalName}MutationInput) {
    const validated = validateInput(${pascalName}MutationInputSchema, input);
    const session = await this.authService.assertAuthenticated();
    return this.repository.create${pascalName}(session.user.id, validated);
  }

  async update${pascalName}(${camelName}Id: string, input: ${pascalName}MutationInput) {
    const validated = validateInput(${pascalName}MutationInputSchema, input);
    const session = await this.authService.assertAuthenticated();
    const existing = await this.repository.get${pascalName}ById(${camelName}Id);
    if (!existing) {
      throw new NotFoundError('${pascalName} not found');
    }
    // TODO: Add ownership check if needed
    return this.repository.update${pascalName}(${camelName}Id, session.user.id, validated);
  }

  async delete${pascalName}(${camelName}Id: string) {
    const session = await this.authService.assertAuthenticated();
    const existing = await this.repository.get${pascalName}ById(${camelName}Id);
    if (!existing) {
      throw new NotFoundError('${pascalName} not found');
    }
    // TODO: Add ownership check if needed
    await this.repository.delete${pascalName}(${camelName}Id, session.user.id);
  }
}
`;
}

function generateQueryKeys(pascalName: string, camelName: string): string {
  return `
// Add to packages/core/src/queries/queryKeys.ts:

// In queryKeys object:
  ${camelName}s: {
    all: ['${camelName}s'] as const,
    lists: () => ['${camelName}s', 'list'] as const,
    list: (query: string) => ['${camelName}s', 'list', query] as const,
    detail: (${camelName}Id: string) => ['${camelName}s', 'detail', ${camelName}Id] as const,
  },

// In staleTimes object:
  ${camelName}s: 1000 * 30, // 30 seconds
`;
}

function generateHooks(pascalName: string, camelName: string, kebabName: string): string {
  return `'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, staleTimes, type ${pascalName}MutationInput } from '@semantic-web/core';
import { useServiceContainer } from '../../providers/AppProviders';

export function use${pascalName}s(query = '') {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.${camelName}s.list(query),
    queryFn: () =>
      container.services.${camelName}Service.list${pascalName}s({
        query,
        limit: 25,
        offset: 0,
      }),
    staleTime: staleTimes.${camelName}s,
  });
}

export function use${pascalName}(${camelName}Id: string) {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.${camelName}s.detail(${camelName}Id),
    queryFn: () => container.services.${camelName}Service.get${pascalName}ById(${camelName}Id),
    staleTime: staleTimes.${camelName}s,
  });
}

export function useCreate${pascalName}() {
  const container = useServiceContainer();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ${pascalName}MutationInput) =>
      container.services.${camelName}Service.create${pascalName}(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.${camelName}s.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    },
  });
}

export function useUpdate${pascalName}(${camelName}Id: string) {
  const container = useServiceContainer();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ${pascalName}MutationInput) =>
      container.services.${camelName}Service.update${pascalName}(${camelName}Id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.${camelName}s.detail(${camelName}Id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.${camelName}s.all });
    },
  });
}

export function useDelete${pascalName}(${camelName}Id: string) {
  const container = useServiceContainer();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => container.services.${camelName}Service.delete${pascalName}(${camelName}Id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.${camelName}s.all });
    },
  });
}
`;
}

function generateListScreen(pascalName: string, camelName: string, kebabName: string): string {
  return `'use client';

import { Card, DataTable, EmptyState, QueryBoundary } from '@semantic-web/ui';
import type { ${pascalName} } from '@semantic-web/core';
import { use${pascalName}s } from './hooks';

const columns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'createdAt' as const, header: 'Created' },
];

function ${pascalName}Row({ item }: { item: ${pascalName} }) {
  return (
    <tr className="border-b border-primary last:border-0">
      <td className="px-4 py-3 text-sm text-primary">{item.name}</td>
      <td className="px-4 py-3 text-sm text-secondary">
        {new Date(item.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
}

export function ${pascalName}sScreen() {
  const ${camelName}sQuery = use${pascalName}s();

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-primary">${pascalName}s</h1>
        <p className="text-secondary">Manage your ${camelName}s</p>
      </header>

      <QueryBoundary query={${camelName}sQuery}>
        {(data) =>
          data.data.length === 0 ? (
            <EmptyState
              title="No ${camelName}s yet"
              description="Create your first ${camelName} to get started."
            />
          ) : (
            <Card className="overflow-hidden p-0">
              <DataTable
                columns={columns}
                data={data.data}
                renderRow={(item) => <${pascalName}Row key={item.id} item={item} />}
              />
            </Card>
          )
        }
      </QueryBoundary>
    </div>
  );
}
`;
}

function generateDetailScreen(pascalName: string, camelName: string, kebabName: string): string {
  return `'use client';

import { Card, QueryBoundary } from '@semantic-web/ui';
import { use${pascalName} } from './hooks';

export function ${pascalName}DetailScreen({ ${camelName}Id }: { ${camelName}Id: string }) {
  const ${camelName}Query = use${pascalName}(${camelName}Id);

  return (
    <div className="grid gap-6">
      <QueryBoundary query={${camelName}Query}>
        {(${camelName}) => (
          <>
            <header>
              <h1 className="text-2xl font-semibold text-primary">{${camelName}.name}</h1>
              <p className="text-secondary">{${camelName}.description ?? 'No description'}</p>
            </header>

            <Card>
              <dl className="grid gap-4">
                <div>
                  <dt className="text-sm font-medium text-secondary">Created</dt>
                  <dd className="text-primary">
                    {new Date(${camelName}.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-secondary">Last Updated</dt>
                  <dd className="text-primary">
                    {new Date(${camelName}.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </Card>
          </>
        )}
      </QueryBoundary>
    </div>
  );
}
`;
}

function generateFeatureIndex(pascalName: string, camelName: string): string {
  return `/**
 * ${pascalName}s Feature Public API
 *
 * This barrel export defines the public contract for the ${camelName}s feature.
 * Import from this file rather than directly from internal modules.
 */

// Screens
export { ${pascalName}sScreen } from './${pascalName}sScreen';
export { ${pascalName}DetailScreen } from './${pascalName}DetailScreen';

// Hooks
export {
  use${pascalName}s,
  use${pascalName},
  useCreate${pascalName},
  useUpdate${pascalName},
  useDelete${pascalName},
} from './hooks';
`;
}

function generateController(pascalName: string, camelName: string): string {
  return `import { ${pascalName}MutationInputSchema, ${pascalName}QuerySchema, type ServiceContainer } from '@semantic-web/core';

export async function get${pascalName}sPageData(
  container: ServiceContainer,
  searchParams?: Record<string, string | string[] | undefined>,
) {
  const query = ${pascalName}QuerySchema.parse({
    query: typeof searchParams?.query === 'string' ? searchParams.query : undefined,
    limit: 25,
    offset: 0,
  });

  return container.services.${camelName}Service.list${pascalName}s(query);
}

export async function get${pascalName}DetailPageData(container: ServiceContainer, ${camelName}Id: string) {
  return container.services.${camelName}Service.get${pascalName}ById(${camelName}Id);
}

export function parse${pascalName}MutationInput(input: unknown) {
  return ${pascalName}MutationInputSchema.parse(input);
}
`;
}

function generateListPage(pascalName: string, camelName: string, kebabName: string): string {
  return `import { ${pascalName}sScreen } from '../../../features/${kebabName}s';

export default function ${pascalName}sPage() {
  return <${pascalName}sScreen />;
}
`;
}

function generateDetailPage(pascalName: string, camelName: string, kebabName: string): string {
  return `import { ${pascalName}DetailScreen } from '../../../../features/${kebabName}s';

export default async function ${pascalName}DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <${pascalName}DetailScreen ${camelName}Id={id} />;
}
`;
}

function generateInstructions(pascalName: string, camelName: string, kebabName: string): string {
  return `
================================================================================
FEATURE GENERATION COMPLETE: ${pascalName}s
================================================================================

Files have been generated. You still need to manually complete these steps:

1. QUERY SCHEMA - Add to packages/core/src/models/query.ts:
   - Add ${pascalName}QuerySchema (see generated instructions file)
   - Export the new type

2. REPOSITORY INTERFACE - Add to packages/core/src/repositories/interfaces.ts:
   - Add ${pascalName}RepositoryInterface
   - Add required imports

3. SERVICE INTERFACE - Add to packages/core/src/services/interfaces.ts:
   - Add ${pascalName}ServiceInterface
   - Add required imports

4. SERVICE IMPLEMENTATION - Add to packages/core/src/services/implementations.ts:
   - Add ${pascalName}Service class
   - Add required imports

5. QUERY KEYS - Add to packages/core/src/queries/queryKeys.ts:
   - Add ${camelName}s to queryKeys object
   - Add ${camelName}s to staleTimes object

6. SERVICE CONTAINER - Update packages/core/src/container/serviceContainer.ts:
   - Add ${camelName}Repository to repositories
   - Add ${camelName}Service to services
   - Wire up in createServiceContainer function

7. REPOSITORY IMPLEMENTATION - Create in packages/api-sdk/src/repositories/:
   - Implement Mock${pascalName}Repository

8. CONTAINER SETUP - Update both:
   - apps/web/lib/client/container.ts
   - apps/web/lib/server/container.ts

9. CORE EXPORTS - Update packages/core/src/index.ts:
   - Export new model, query schema, and types

10. VERIFY:
    - Run: pnpm typecheck
    - Run: pnpm build
    - Run: pnpm lint

See the generated _INSTRUCTIONS.md file for detailed code snippets.
================================================================================
`;
}

// ============================================================================
// Main Generator
// ============================================================================

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Feature Generator - Creates boilerplate for new feature modules

Usage:
  pnpm generate:feature <feature-name>

Examples:
  pnpm generate:feature user-settings
  pnpm generate:feature blog-post
  pnpm generate:feature notification

The feature name should be singular and kebab-case.
The generator will create plural forms where appropriate.
`);
    process.exit(0);
  }

  const featureName = args[0];
  const kebabName = toKebabCase(featureName);
  const pascalName = toPascalCase(featureName);
  const camelName = toCamelCase(featureName);

  console.log(`\nGenerating feature: ${pascalName}s (${kebabName}s)\n`);

  const ROOT = path.resolve(__dirname, '..');
  const CORE = path.join(ROOT, 'packages/core/src');
  const WEB = path.join(ROOT, 'apps/web');

  // Create directories
  const featureDir = path.join(WEB, 'features', `${kebabName}s`);
  const routeDir = path.join(WEB, 'app/(protected)', `${kebabName}s`);
  const routeDetailDir = path.join(routeDir, '[id]');

  console.log('Creating directories...');
  ensureDir(featureDir);
  ensureDir(routeDir);
  ensureDir(routeDetailDir);

  // Generate model file
  console.log('\nGenerating core model...');
  writeFile(
    path.join(CORE, 'models', `${camelName}.ts`),
    generateModel(pascalName, camelName),
  );

  // Generate feature files
  console.log('\nGenerating feature files...');
  writeFile(path.join(featureDir, 'hooks.ts'), generateHooks(pascalName, camelName, kebabName));
  writeFile(path.join(featureDir, `${pascalName}sScreen.tsx`), generateListScreen(pascalName, camelName, kebabName));
  writeFile(path.join(featureDir, `${pascalName}DetailScreen.tsx`), generateDetailScreen(pascalName, camelName, kebabName));
  writeFile(path.join(featureDir, 'index.ts'), generateFeatureIndex(pascalName, camelName));

  // Generate controller
  console.log('\nGenerating controller...');
  writeFile(
    path.join(WEB, 'controllers', `${camelName}sController.ts`),
    generateController(pascalName, camelName),
  );

  // Generate route pages
  console.log('\nGenerating route pages...');
  writeFile(path.join(routeDir, 'page.tsx'), generateListPage(pascalName, camelName, kebabName));
  writeFile(path.join(routeDetailDir, 'page.tsx'), generateDetailPage(pascalName, camelName, kebabName));

  // Generate instructions file
  console.log('\nGenerating instruction snippets...');
  const instructionsContent = `# ${pascalName}s Feature - Manual Integration Steps

This file contains code snippets to copy into existing files.

## 1. Query Schema (packages/core/src/models/query.ts)

Add this schema:

\`\`\`typescript
export const ${pascalName}QuerySchema = PaginationSchema.extend({
  query: z.string().optional(),
  userId: z.string().uuid().optional(),
});

export type ${pascalName}Query = z.infer<typeof ${pascalName}QuerySchema>;
\`\`\`

## 2. Repository Interface (packages/core/src/repositories/interfaces.ts)

Add imports and interface:

\`\`\`typescript
import type { ${pascalName}, ${pascalName}MutationInput } from '../models/${camelName}';
import type { ${pascalName}Query } from '../models/query';

export interface ${pascalName}RepositoryInterface {
  list${pascalName}s(query: ${pascalName}Query): Promise<PaginatedResult<${pascalName}>>;
  get${pascalName}ById(${camelName}Id: string): Promise<${pascalName} | null>;
  create${pascalName}(userId: string, input: ${pascalName}MutationInput): Promise<${pascalName}>;
  update${pascalName}(${camelName}Id: string, userId: string, input: ${pascalName}MutationInput): Promise<${pascalName}>;
  delete${pascalName}(${camelName}Id: string, userId: string): Promise<void>;
}
\`\`\`

## 3. Service Interface (packages/core/src/services/interfaces.ts)

Add imports and interface:

\`\`\`typescript
import type { ${pascalName}, ${pascalName}MutationInput } from '../models/${camelName}';
import type { ${pascalName}Query } from '../models/query';

export interface ${pascalName}ServiceInterface {
  list${pascalName}s(query: ${pascalName}Query): Promise<PaginatedResult<${pascalName}>>;
  get${pascalName}ById(${camelName}Id: string): Promise<${pascalName}>;
  create${pascalName}(input: ${pascalName}MutationInput): Promise<${pascalName}>;
  update${pascalName}(${camelName}Id: string, input: ${pascalName}MutationInput): Promise<${pascalName}>;
  delete${pascalName}(${camelName}Id: string): Promise<void>;
}
\`\`\`

## 4. Service Implementation (packages/core/src/services/implementations.ts)

Add imports and class:

\`\`\`typescript
import { ${pascalName}MutationInputSchema, type ${pascalName}MutationInput } from '../models/${camelName}';
import { ${pascalName}QuerySchema, type ${pascalName}Query } from '../models/query';
import type { ${pascalName}RepositoryInterface } from '../repositories/interfaces';
import type { ${pascalName}ServiceInterface } from './interfaces';

export class ${pascalName}Service implements ${pascalName}ServiceInterface {
  constructor(
    private readonly repository: ${pascalName}RepositoryInterface,
    private readonly authService: AuthServiceInterface,
  ) {}

  async list${pascalName}s(query: ${pascalName}Query) {
    const validated = validateInput(${pascalName}QuerySchema, query);
    const session = await this.authService.assertAuthenticated();
    return this.repository.list${pascalName}s({ ...validated, userId: session.user.id });
  }

  async get${pascalName}ById(${camelName}Id: string) {
    await this.authService.assertAuthenticated();
    const ${camelName} = await this.repository.get${pascalName}ById(${camelName}Id);
    if (!${camelName}) {
      throw new NotFoundError('${pascalName} not found');
    }
    return ${camelName};
  }

  async create${pascalName}(input: ${pascalName}MutationInput) {
    const validated = validateInput(${pascalName}MutationInputSchema, input);
    const session = await this.authService.assertAuthenticated();
    return this.repository.create${pascalName}(session.user.id, validated);
  }

  async update${pascalName}(${camelName}Id: string, input: ${pascalName}MutationInput) {
    const validated = validateInput(${pascalName}MutationInputSchema, input);
    const session = await this.authService.assertAuthenticated();
    const existing = await this.repository.get${pascalName}ById(${camelName}Id);
    if (!existing) {
      throw new NotFoundError('${pascalName} not found');
    }
    return this.repository.update${pascalName}(${camelName}Id, session.user.id, validated);
  }

  async delete${pascalName}(${camelName}Id: string) {
    const session = await this.authService.assertAuthenticated();
    const existing = await this.repository.get${pascalName}ById(${camelName}Id);
    if (!existing) {
      throw new NotFoundError('${pascalName} not found');
    }
    await this.repository.delete${pascalName}(${camelName}Id, session.user.id);
  }
}
\`\`\`

## 5. Query Keys (packages/core/src/queries/queryKeys.ts)

Add to queryKeys object:

\`\`\`typescript
${camelName}s: {
  all: ['${camelName}s'] as const,
  lists: () => ['${camelName}s', 'list'] as const,
  list: (query: string) => ['${camelName}s', 'list', query] as const,
  detail: (${camelName}Id: string) => ['${camelName}s', 'detail', ${camelName}Id] as const,
},
\`\`\`

Add to staleTimes object:

\`\`\`typescript
${camelName}s: 1000 * 30, // 30 seconds
\`\`\`

## 6. Service Container (packages/core/src/container/serviceContainer.ts)

Update ServiceContainer type:

\`\`\`typescript
repositories: {
  // ... existing
  ${camelName}Repository: ${pascalName}RepositoryInterface;
};
services: {
  // ... existing
  ${camelName}Service: ${pascalName}ServiceInterface;
};
\`\`\`

Update createServiceContainer function:

\`\`\`typescript
const ${camelName}Service = new ${pascalName}Service(dependencies.${camelName}Repository, authService);

return {
  repositories: dependencies,
  services: {
    // ... existing
    ${camelName}Service,
  },
};
\`\`\`

## 7. Core Exports (packages/core/src/index.ts)

Add exports:

\`\`\`typescript
export * from './models/${camelName}';
\`\`\`

## 8. Container Setup

Update apps/web/lib/client/container.ts and apps/web/lib/server/container.ts
to include the new repository.

After completing all steps, run:
- pnpm typecheck
- pnpm build
- pnpm lint
`;

  writeFile(path.join(featureDir, '_INSTRUCTIONS.md'), instructionsContent);

  console.log(generateInstructions(pascalName, camelName, kebabName));
}

main();
