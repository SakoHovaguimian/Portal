// **************************************
// MARK: - CREATE ACCOUNT TOOLS QUERY PARAMETERS
// **************************************

export function accountToolsQueryParams(values: object) {

  const queryParameters = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {

    if (value !== undefined && value !== '') { queryParameters.set(key, String(value)); }

  });
  return queryParameters;

}
