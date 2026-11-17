export type DashboardModelMetaTransport = {
  key: string;
  display_name: string;
  display_name_singular: string;
  total_records: number;
  date_field: string;
  label_field: string;
  fields: Array<{
    name: string;
    type: string;
    display_name: string;
    displayable: boolean;
    filterable: boolean;
    searchable: boolean;
    sensitive: boolean;
    sortable: boolean;
    aggregatable: boolean;
  }>;
  relations: Array<{
    name: string;
    model: string;
    type: string;
    foreign_key: string;
    display_field: string;
  }>;
};
