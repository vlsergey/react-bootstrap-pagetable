export type Direction = 'ASC' | 'DESC';

export type SortBy = {
  field: string,
  direction?: Direction,
};

interface FetchArgs {
  /** 0-based page to fetch */
  page?: number,
  /** Max number of items per page to fetch */
  size?: number,

  filter?: Record<string, unknown>,

  /** Sort by field.
  If multiple fields are specified sort done in order is from last to first.
  (i.e. reversed before put in (for example) ORDER BY clause of SQL query) */
  sort?: SortBy[],
}

export default FetchArgs;
