# New Query Hook Family Prompt

Use this prompt when adding TanStack Query hooks for a new feature.

## Typed Query Keys

This template uses `@lukemorales/query-key-factory` for type-safe query keys.

### Adding New Keys

Add to `packages/core/src/queries/queryKeys.ts`:

```typescript
export const queryKeys = createQueryKeyStore({
  // ... existing keys
  featureName: {
    all: null,
    list: (query: string) => [query],
    detail: (id: string) => [id],
  },
});
```

Add stale time:

```typescript
export const staleTimes = {
  // ... existing
  featureName: 1000 * 30, // 30 seconds
} as const;
```

## Hook Implementation

Add hooks in `apps/web/features/<feature>/hooks.ts`:

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, staleTimes, type FeatureMutationInput } from '@semantic-web/core';
import { useServiceContainer } from '../../providers/AppProviders';

export function useFeatures(query = '') {
  const container = useServiceContainer();
  return useQuery({
    // Use .queryKey for typed keys
    queryKey: queryKeys.featureName.list(query).queryKey,
    queryFn: () => container.services.featureService.listFeatures({ query, limit: 25, offset: 0 }),
    staleTime: staleTimes.featureName,
  });
}

export function useCreateFeature() {
  const container = useServiceContainer();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: FeatureMutationInput) =>
      container.services.featureService.createFeature(input),
    onSuccess: () => {
      // Use ._def to invalidate all queries in the group
      void queryClient.invalidateQueries({ queryKey: queryKeys.featureName._def });
    },
  });
}
```

## Key Patterns

| Action | Query Key Pattern |
|--------|------------------|
| Fetch single item | `queryKeys.feature.detail(id).queryKey` |
| Fetch list | `queryKeys.feature.list(query).queryKey` |
| Invalidate all | `queryKeys.feature._def` |
| Invalidate specific | `queryKeys.feature.detail(id).queryKey` |

## Rules

1. **Always use `.queryKey`** - The factory returns objects, not arrays
2. **Services via container** - Never call repositories directly
3. **Invalidate explicitly** - Include related queries (e.g., dashboard.overview)
4. **Match SSR composers** - Use the same query keys in `serverQueries.ts`

## Verify

- `pnpm typecheck` passes
- SSR hydration matches client queries
