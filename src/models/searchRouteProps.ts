export interface SearchRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
