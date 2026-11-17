import 'server-only';

import { portalModules } from '@/config/portalModules';
import { NotFoundError } from '@/errors/domainErrors';
import { dashboardModelMeta } from '@/services/demo/demoFixtures';
import type { DemoRequestHandler } from '@/services/demo/models/demoRequestHandler';
import { strings } from '@/strings';

// **************************************
// MARK: - HANDLE DEMO DASHBOARD
// **************************************

export const handleDemoDashboard: DemoRequestHandler = async ({
  request,
  parts,
  url,
  state,
  current,
  json,
  page,
  empty,
}) => {

  const [resource, id] = parts;
  if (resource !== 'dashboard' || request.method !== 'GET') { return null; }
  const search = (
    url.searchParams.get('query') ||
    url.searchParams.get('search') ||
    ''
  )
    .trim()
    .toLowerCase();
  const visibleRequests = state.featureRequests.filter(
    (item) => !item.deleted && item.user_id === current.id,
  );
  const models = [
    {
      key: 'user',
      display_name: strings.ui.demoApiClient.users,
      field_count: 10,
      record_count: empty ? 0 : state.users.length,
    },
    {
      key: 'featureRequest',
      display_name: strings.ui.demoApiClient.featureRequests,
      field_count: 7,
      record_count: empty ? 0 : visibleRequests.length,
    },
  ].filter((model) => model.key === 'user' ? portalModules.users : portalModules.featureRequests);
  if (id === 'overview') {

    const overviewResponse = json({
      models: models.map((model) => {

        const modelOverview = ({
          model: model.key,
          display_name: model.display_name,
          total_count: model.record_count,
          period_count: empty
            ? 0
            : (model.key === 'user' ? state.users : visibleRequests).filter(
              (item) =>
                Date.parse(item.created_at) >= Date.now() - 30 * 86400000,
            ).length,
          growth_percent: null,
        });

        return modelOverview;

      }),
      date_range: {
        from: new Date(Date.now() - 30 * 86400000).toISOString(),
        to: new Date().toISOString(),
      },
    });

    return overviewResponse;

  }
  if (id === 'models' && !parts[2]) { return json({ models }); }
  if (id === 'models') {

    const meta = dashboardModelMeta[parts[2]];
    if (!meta || !models.some((model) => model.key === parts[2])) { throw new NotFoundError(); }
    return json({
      ...meta,
      total_records: empty
        ? 0
        : parts[2] === 'user'
          ? state.users.length
          : visibleRequests.length,
    });

  }
  if (id === 'records') {

    const model = url.searchParams.get('model');
    if ((model !== 'user' && model !== 'featureRequest') || !models.some((item) => item.key === model)) { throw new NotFoundError(); }
    const rows = model === 'user' ? state.users : visibleRequests;
    const recordsResponse = json(
      page(
        rows.filter((item) =>
          JSON.stringify(item).toLowerCase().includes(search),
        ),
      ),
    );

    return recordsResponse;

  }

  return null;

};
