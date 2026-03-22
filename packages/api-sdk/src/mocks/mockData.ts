import type {
  DashboardModelMetaTransport,
  DashboardModelSummaryTransport,
  DashboardOverviewTransport,
  FeatureRequestTransport,
  UserTransport,
} from '../client/types';

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 86400000).toISOString();

export const users: UserTransport[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    external_id: 'firebase-demo-user-1',
    first_name: 'Sako',
    last_name: 'Template',
    email: 'sako@example.com',
    phone_number: '+1 555 111 0001',
    date_of_birth: daysAgo(12000),
    created_at: daysAgo(120),
    updated_at: daysAgo(1),
    deleted: false,
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    external_id: 'firebase-demo-user-2',
    first_name: 'Ada',
    last_name: 'Operator',
    email: 'ada@example.com',
    phone_number: '+1 555 111 0002',
    date_of_birth: daysAgo(10000),
    created_at: daysAgo(90),
    updated_at: daysAgo(2),
    deleted: false,
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    external_id: 'firebase-demo-user-3',
    first_name: 'Mina',
    last_name: 'Signals',
    email: 'mina@example.com',
    phone_number: null,
    date_of_birth: null,
    created_at: daysAgo(45),
    updated_at: daysAgo(7),
    deleted: false,
  },
];

export const featureRequests: FeatureRequestTransport[] = [
  {
    id: '44444444-4444-4444-8444-444444444444',
    user_id: users[0].id,
    message: 'Add semantic dashboard saved views with sharable filters.',
    created_at: daysAgo(20),
    updated_at: daysAgo(3),
    deleted: false,
    user: users[0],
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    user_id: users[0].id,
    message: 'Expose feature request ownership history for audit trails.',
    created_at: daysAgo(10),
    updated_at: daysAgo(2),
    deleted: false,
    user: users[0],
  },
  {
    id: '66666666-6666-4666-8666-666666666666',
    user_id: users[1].id,
    message: 'Support compact table mode with pinned columns.',
    created_at: daysAgo(5),
    updated_at: daysAgo(1),
    deleted: false,
    user: users[1],
  },
];

export const dashboardOverview: DashboardOverviewTransport = {
  models: [
    { model: 'user', display_name: 'Users', total_count: 3, period_count: 1, growth_percent: 0.33 },
    { model: 'featureRequest', display_name: 'Feature Requests', total_count: 3, period_count: 2, growth_percent: 0.66 },
    { model: 'dashboardView', display_name: 'Dashboard Views', total_count: 8, period_count: 3, growth_percent: 0.37 },
  ],
  date_range: {
    from: daysAgo(30),
    to: now.toISOString(),
  },
};

export const dashboardModels: DashboardModelSummaryTransport[] = [
  { key: 'user', display_name: 'Users', field_count: 10, record_count: users.length },
  { key: 'featureRequest', display_name: 'Feature Requests', field_count: 7, record_count: featureRequests.length },
];

export const dashboardModelMeta: Record<string, DashboardModelMetaTransport> = {
  user: {
    key: 'user',
    display_name: 'Users',
    display_name_singular: 'User',
    total_records: users.length,
    date_field: 'created_at',
    label_field: 'email',
    fields: [
      { name: 'id', type: 'uuid', display_name: 'ID', displayable: true, filterable: false, searchable: false, sensitive: false, sortable: false, aggregatable: false },
      { name: 'email', type: 'string', display_name: 'Email', displayable: true, filterable: true, searchable: true, sensitive: true, sortable: true, aggregatable: false },
      { name: 'first_name', type: 'string', display_name: 'First Name', displayable: true, filterable: true, searchable: true, sensitive: false, sortable: true, aggregatable: false },
      { name: 'last_name', type: 'string', display_name: 'Last Name', displayable: true, filterable: true, searchable: true, sensitive: false, sortable: true, aggregatable: false }
    ],
    relations: [
      { name: 'feature_requests', model: 'featureRequest', type: 'hasMany', foreign_key: 'user_id', display_field: 'message' }
    ]
  },
  featureRequest: {
    key: 'featureRequest',
    display_name: 'Feature Requests',
    display_name_singular: 'Feature Request',
    total_records: featureRequests.length,
    date_field: 'created_at',
    label_field: 'message',
    fields: [
      { name: 'id', type: 'uuid', display_name: 'ID', displayable: true, filterable: false, searchable: false, sensitive: false, sortable: false, aggregatable: false },
      { name: 'user_id', type: 'uuid', display_name: 'User ID', displayable: true, filterable: true, searchable: false, sensitive: false, sortable: false, aggregatable: false },
      { name: 'message', type: 'string', display_name: 'Message', displayable: true, filterable: false, searchable: true, sensitive: false, sortable: false, aggregatable: false },
      { name: 'created_at', type: 'date', display_name: 'Created At', displayable: true, filterable: true, searchable: false, sensitive: false, sortable: true, aggregatable: true }
    ],
    relations: [
      { name: 'user', model: 'user', type: 'belongsTo', foreign_key: 'user_id', display_field: 'email' }
    ]
  }
};
