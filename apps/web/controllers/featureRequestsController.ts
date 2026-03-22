import { FeatureRequestMutationInputSchema, FeatureRequestQuerySchema, type ServiceContainer } from '@semantic-web/core';

export async function getFeatureRequestsPageData(
  container: ServiceContainer,
  searchParams?: Record<string, string | string[] | undefined>,
) {
  const query = FeatureRequestQuerySchema.parse({
    query: typeof searchParams?.query === 'string' ? searchParams.query : undefined,
    limit: 25,
    offset: 0,
  });

  return container.services.featureRequestService.listFeatureRequests(query);
}

export async function getFeatureRequestDetailPageData(container: ServiceContainer, featureRequestId: string) {
  return container.services.featureRequestService.getFeatureRequestById(featureRequestId);
}

export function parseFeatureRequestMutationInput(input: unknown) {
  return FeatureRequestMutationInputSchema.parse(input);
}
